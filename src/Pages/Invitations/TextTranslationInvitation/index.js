import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import querystring from 'query-string';

import LoaderComponent from '../../../shared/components/LoaderComponent';

import * as actions from '../modules/actions';

class TextTranslationInvitation extends React.Component {

    componentWillMount = () => {
        /*
            aid: articleId
            s: status | accepted|declined
            t: auth token sent in the email
            o: organizationId

        */
        const { aid, s, t, email, o } = querystring.parse(window.location.search)
        this.props.respondToTextTranslationInvitation(o, aid, s, t, email);
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
});

const mapDispatchToProps = (dispatch) => ({
    respondToTextTranslationInvitation: (organizationId, articleId, status, token, email) => dispatch(actions.respondToTextTranslationInvitation(organizationId, articleId, status, token, email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TextTranslationInvitation));