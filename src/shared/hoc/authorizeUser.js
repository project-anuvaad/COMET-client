import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserOrganziationRole, canUserAccess } from '../utils/helpers';
import routes from '../routes';

export default function authorizeUser(WrappedComponent, roles) {


    class CanView extends React.Component {

        redirectUnauthorizedUser = () => {
            const { user, organization } = this.props;
            const organizationRole = getUserOrganziationRole(user, organization);
            if (!organizationRole) {
                return this.props.history.push(routes.logout());
            }
            if (canUserAccess(user, organization, [
                'translate',
                'voice_over_artist',
                'translate_text',
                'approve_translations',
            ])) {
                return this.props.history.push(routes.organziationTranslations());
            }
            if (canUserAccess(user, organization, [
                'review',
                'break_videos',
                'transcribe_text',
                'approve_transcriptions',
            ])) {
                return this.props.history.push(routes.organziationReview());
            }
            // return this.props.history.push(routes.logout());

        }

        render() {
            const userRole = getUserOrganziationRole(this.props.user, this.props.organization)
            let canView = false;
            if (userRole && userRole.organizationOwner) {
                canView = true;
            } else if (userRole) {
                if (userRole && userRole.permissions.some(p => roles.indexOf(p) !== -1)) {
                    canView = true;
                }
            }
            if (!canView) {
                this.redirectUnauthorizedUser();
            }
            return canView ? <WrappedComponent {...this.props} /> : <div>You don't have permissions to view this page</div>;
        }
    }

    const mapStateToProps = ({ organization, authentication }) => ({
        organization: organization.organization,
        user: authentication.user,
    })

    return withRouter(connect(mapStateToProps)(CanView));
}
