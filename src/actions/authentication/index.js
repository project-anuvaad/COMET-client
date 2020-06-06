import * as actionTypes from './types';
import * as orgActionTypes from '../organization/types';

import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { push } from 'connected-react-router';
import routes from '../../shared/routes';
import NotificationService from '../../shared/utils/NotificationService';

export const authenticationSuccess = (userData) => ({
    type: actionTypes.AUTHENTICATION_SUCCESS,
    payload: userData,
})

export const authenticationFailed = (message) => ({
    type: actionTypes.AUTHENTICATION_FAILED,
    payload: message,
})

const signUpSuccess = () => ({
    type: actionTypes.SIGNUP_SUCCESS
})

const signUpFaild = (message) => ({
    type: actionTypes.SIGNUP_FAILED,
    payload: message
})

const validateToken = (isValid) => ({
    type: actionTypes.VALIDATE_TOKEN,
    payload: isValid
})

const setGetUserDetailsLoading = loading => ({
    type: actionTypes.SET_GET_USER_DETAILS_LOADING,
    payload: loading,
})

const setUser = user => ({
    type: actionTypes.SET_USER,
    payload: user,
})

const setSignupLoading = loading => ({
    type: actionTypes.SET_SIGNUP_LOADING,
    payload: loading,
})

const setResetPasswordLoading = loading => ({
    type: actionTypes.SET_PASSWORD_RESET_LOADING,
    payload: loading,
})

const setApiKey = (key) => ({
    type: actionTypes.SET_USER_API_KEY,
    payload: key,
})

export const getUserDetails = () => (dispatch) => {
    dispatch(setGetUserDetailsLoading(true))
    requestAgent.get(Api.user.getUserDetails())
    .then((res) => {
        const userData = res.body;
        dispatch(setUser(userData));
        dispatch(setGetUserDetailsLoading(false));

    })
    .catch(err => {
        dispatch(push(routes.logout()));
    })
}

export const redirectToSwitchOrganization = (token, organization, redirectTo = '') => dispatch => {
    const { protocol, hostname } = window.location;
    const hostParts = hostname.split('.')
    let targetLocation = `${protocol}//${organization.name.replace(/\s/g, '-')}.${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}${routes.loginRedirect()}?t=${token}&o=${organization._id}`;
    if (redirectTo) {
        targetLocation += `&redirectTo=${redirectTo}`;
    }
    window.location.href = targetLocation;
}

export const authenticateWithToken = (token, organizationId, redirectTo = '') => dispatch => {
    requestAgent.post(Api.authentication.refreshToken(), {
        token,
    }).then(result => {
        const { success, token, user } = result.body;

        const defaultOrg = user.organizationRoles.find(r => r.organization._id === organizationId).organization;
        if (success) {
            dispatch({
                type: orgActionTypes.SET_ORGANIZATION,
                payload: defaultOrg
            })
            setTimeout(() => {
                dispatch(authenticationSuccess({ token, user }));
                // Redirect to subroute of organization
                if (redirectTo) {
                    dispatch(push(redirectTo));
                } else {
                    dispatch(push(routes.organizationHome()))
                }
            }, 500);
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(push(routes.logout()));
    })
}

export const logout = () => ({
    type: actionTypes.LOGOUT,
})

const loginSuccess = (user, token) => (dispatch) => {
    const defaultOrg = user.organizationRoles[0].organization;
    dispatch({
        type: orgActionTypes.SET_ORGANIZATION,
        payload: defaultOrg
    })
    setTimeout(() => {
        dispatch(authenticationSuccess({ token, user }));
        // Redirect to subroute of organization
        dispatch(redirectToSwitchOrganization(token, defaultOrg));
    }, 500);
}

export const login = ({ email, password }) => dispatch => {
    requestAgent.post(Api.authentication.login(), {
        email,
        password,
        temp: true,
    }).then(result => {
        const { success, token, user } = result.body;
        if (success) {
            dispatch(loginSuccess(user, token));
        } else {
            NotificationService.error('Invalid email or password')
            // dispatch(authenticationFailed('Email or Password in invalid'));
        }
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const signUp = ({ orgName, email, password, logo, firstname, lastname }) => dispatch => {
    dispatch(setSignupLoading(true))
    const req = requestAgent.post(Api.authentication.register())
    .field('email', email)
    .field('firstname', firstname)
    .field('lastname', lastname)
    .field('password', password)
    .field('orgName', orgName);
    if (logo) {
        req.attach('logo', logo);
    }

    req.then(result => {
        const { success, message } = result.body;

        if (success) {
            dispatch(signUpSuccess());
            login({email, password})(dispatch)
        } else {
            dispatch(signUpFaild(message));
        }
        dispatch(setSignupLoading(false));

    })
    .catch((err) => {
        console.log(err);
        dispatch(setSignupLoading(false));
        NotificationService.responseError(err);
    })
}

export const emailResetPassword = (email) => (dispatch) => {
    dispatch(setResetPasswordLoading(true));

    requestAgent
    .post(Api.authentication.resetPassword(), { email })
    .then((res) => {
        NotificationService.success('Please check your email for reset instructions');
        dispatch(setResetPasswordLoading(false));

    })
    .catch(err => {
        console.log(err);
        dispatch(setResetPasswordLoading(false));
        NotificationService.responseError(err);
    })
}


export const resetPassword = (email, resetCode, password, passwordConfirm) => (dispatch) => {
    dispatch(setResetPasswordLoading(true));
    requestAgent
    .post(Api.user.resetPassword(), { email, resetCode, password, passwordConfirm })
    .then((res) => {
        const { user, token } = res.body;
        NotificationService.success('Password was successfully reset');
        dispatch(loginSuccess(user, token));
        dispatch(setResetPasswordLoading(false));

    })
    .catch(err => {
        console.log(err);
        dispatch(setResetPasswordLoading(false));
        NotificationService.responseError(err);
    })
}

export const isValidToken = () => (dispatch, getState) => {
    requestAgent.get(Api.user.isValidToken()).then(({ body }) => {
        const { isValid, user } = body;
        dispatch(validateToken(isValid))
        console.log('isvalid token')
        if (user && user.organizationRoles) {
            dispatch(authenticationSuccess({ user }));
            // dispatch({
            //     type: orgActionTypes.SET_ORGANIZATION,
            //     payload: user.organizationRoles[0].organization
            // })
        }
    })
}

export const updateShowUserGuiding = showUserGuiding => (dispatch, getState) => {
    requestAgent.patch(Api.user.updateShowUserGuiding(), { showUserGuiding })
    .then(({ body }) => {
        const { user } = getState().authentication;
        user.showUserGuiding = showUserGuiding;
        dispatch(setUser({ ...user }));
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const fetchUserApiKey = (organizationId) => (dispatch) => {
    requestAgent.get(Api.apiKeys.getUserOrganizationApiKey(organizationId)).then(({ body }) => {
        const { apiKey } = body;
        dispatch(setApiKey(apiKey))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

const setSubscribeToApiDocsLoading = loading => ({
    type: actionTypes.SET_SUBSCRIBE_TO_API_DOCS_LOADING,
    payload: loading,
})

export const subscribeToApiDocs = (email) => (dispatch) => {
    dispatch(setSubscribeToApiDocsLoading(true))
    requestAgent.post(Api.user.subscribeToApiDocs(), { email })
    .then(({ body }) => {
        dispatch(setSubscribeToApiDocsLoading(false))
        NotificationService.success('Your email have been added successfully, you\'ll be notified once the docs are available');
    })
    .catch(err => {
        dispatch(setSubscribeToApiDocsLoading(false));
        console.log(err);
        NotificationService.responseError(err);
    })
}
