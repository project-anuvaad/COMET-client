import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as authActions from '../../actions/authentication';
import { APP_ENV } from '../../shared/constants';

class Logout extends React.Component {

    componentWillMount() {
        this.props.logout();
        if (!this.props.isAuthenticated) {
            const { protocol } = window.location;
            window.location.href = `${protocol}//${APP_ENV.FRONTEND_HOST_NAME}`;
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('will recieve props')
        if (!nextProps.isAuthenticated) {
            const { protocol } = window.location;
            window.location.href = `${protocol}//${APP_ENV.FRONTEND_HOST_NAME}`;
        }
    }

    render() {
        return (
            <div>Logging out</div>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
})

const mapStateToProps = ({ authentication }) => ({
    isAuthenticated: authentication.isAuthenticated,
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout))
