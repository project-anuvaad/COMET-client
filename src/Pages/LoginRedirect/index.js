import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import { authenticateWithToken } from '../../actions/authentication';
import LoaderOverlay from '../../shared/components/LoaderOverlay';

class LoginRedirect extends React.Component {

    componentWillMount = () => {
        const { t, o, redirectTo } = querystring.parse(window.location.search);
        this.props.authenticateWithToken(t, o, redirectTo)
    }
    render() {
        return (
            <LoaderOverlay />
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    authenticateWithToken: (token, organizationId, redirectTo) => dispatch(authenticateWithToken(token, organizationId, redirectTo)),
})

export default connect(null, mapDispatchToProps)(LoginRedirect);