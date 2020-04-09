import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import querystring from 'query-string';
import { Form, Label, Grid } from 'semantic-ui-react';

import LoaderComponent from '../../../shared/components/LoaderComponent';

import * as actions from '../modules/actions';

class TranslationInvitation extends React.Component {

    componentWillMount = () => {
        /*
            aid: articleId
            s: status | accepted|declined
            t: auth token sent in the email
            o: organizationId

        */
        const { aid, s, t, email, o } = querystring.parse(window.location.search)
        this.props.respondToTranslationInvitation(o, aid, s, t, email);
    }

    render() {
        return (
            <LoaderComponent active={this.props.loading}>
                    TranslationInvitation
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ invitations }) => ({
    loading: invitations.loading,
    password: invitations.password,
    passwordConfirm: invitations.passwordConfirm,
    showPasswordForm: invitations.showPasswordForm,
    passwordLoading: invitations.passwordLoading,
});

const mapDispatchToProps = (dispatch) => ({
    respondToTranslationInvitation: (organizationId, articleId, status, token, email) => dispatch(actions.respondToTranslationInvitation(organizationId, articleId, status, token, email)),
    setPassword: password => dispatch(actions.setPassword(password)),
    setPasswordConfirm: password => dispatch(actions.setPasswordConfirm(password)),
    updatePassword: () => dispatch(actions.updatePassword())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TranslationInvitation));