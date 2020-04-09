import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import NotificationService from '../../shared/utils/NotificationService';
import { redirectToSwitchOrganization } from '../../shared/utils/helpers';

const fetchUserSuccess = (users) => ({
    type: actionTypes.FETCH_USER_SUCCESS,
    payload: users
});

const inviteUserSuccess = (user) => ({
    type: actionTypes.INVITE_USER_SUCCESS,
    payload: user
});

const inviteUserError = (message) => ({
    type: actionTypes.INVITE_USER_ERROR,
    payload: message
});

const removeUserSuccess = (userId) => ({
    type: actionTypes.REMOVE_USER_SUCCESS,
    payload: userId
});

const editPermissionSuccess = (payload) => ({
    type: actionTypes.CHANGE_PERMISSION_SUCCESS,
    payload
});

const setCreateOrganizationLoading = loading => ({
    type: actionTypes.SET_CREATE_ORGANIZATION_LOADING,
    payload: loading,
})

export const setUserGuidingTutorialModalOpen = open => ({
    type: actionTypes.SET_USER_GUIDING_TUTORIAL_MODAL_OPEN,
    payload: open,
})

export const setUserGuidingShowed = (show) => ({
    type: actionTypes.SET_USER_GUIDING_SHOWED,
    payload: show,
})

export const setNewOrganizationName = name => ({
    type: actionTypes.SET_NEW_ORGANIZATION_NAME,
    payload: name,
})

export const setNewOrganizationLogo = file => ({
    type: actionTypes.SET_NEW_ORGANIZATION_LOGO,
    payload: file,
})

export const setUploadLogoLoading = loading => ({
    type: actionTypes.SET_UPLOAD_LOGO_LOADING,
    payload: loading,
})

export const setOrganization = organization => ({
    type: actionTypes.SET_ORGANIZATION,
    payload: organization,
})

export const updateOrganizationLogo = file => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setUploadLogoLoading(true))
    requestAgent.patch(Api.organization.updateLogo(organization._id))
    .attach('logo', file)
    .then((res) => {
        const { organization } = res.body;
        dispatch(setOrganization(organization));
        dispatch(setUploadLogoLoading(false))
    })
    .catch((err) => {
        console.log(err);
        dispatch(setUploadLogoLoading(false))
        NotificationService.responseError(err);
    })
}

export const createOrganization = (name, logoFile) => (dispatch, getState) => {
    dispatch(setCreateOrganizationLoading(true));
    const req = requestAgent.post(Api.organization.createOrganization())
    .field('name', name)
    if (logoFile) {
        req.attach('logo', logoFile);
    }
    req.then((res) => {
        const { organization } = res.body;
        const { token } = getState().authentication;

        dispatch(setCreateOrganizationLoading(false));
        dispatch(setNewOrganizationName(''));
        dispatch(setNewOrganizationLogo(null));
        NotificationService.success('Organization created successfully');
        setTimeout(() => {
            redirectToSwitchOrganization(token, organization);
        }, 500);
    })
    .catch((err) => {
        console.log(err);
        dispatch(setCreateOrganizationLoading(false));
        NotificationService.responseError(err);
    })
}

export const fetchOrganization = organizationId => dispatch => {
    requestAgent
    .get(Api.organization.getOrganizationById(organizationId))
    .then(({ body }) => {
        dispatch(setOrganization(body.organization));
    })
    .catch(err => {
        console.log(err)
    })
}

export const fetchUsers = (organizationId) => dispatch => {
    requestAgent.get(Api.organization.getUsers({ organization: organizationId }))
        .then(({ body }) => {
            dispatch(fetchUserSuccess(body));
        });
}

export const inviteUser = (organizationId, {  email, firstname, lastname, permissions }) => dispatch => {
    requestAgent.post(Api.organization.inviteUser(organizationId), { email, firstname, lastname, permissions })
        .then(({ body }) => {
            const { success, user, message } = body;

            if (success) {
                dispatch(inviteUserSuccess(user));
            } else {
                dispatch(inviteUserError(message));
            }
        });
}

export const editPermissions = (organizationId, userId, permissions) => (dispatch, getState) => {
    requestAgent.patch(Api.organization.editPermissions(organizationId, userId), { permissions })
        .then(({ body }) => {
            const users = getState().organization.users
            users.find((u) => u._id === userId).organizationRoles.find(role => role.organization === organizationId).permissions = permissions;
            dispatch(editPermissionSuccess({
                userId,
                permissions
            }));
            dispatch(fetchUserSuccess([...users]));
        });
}

export const removeUser = (organizationId, userId) => dispatch => {
    requestAgent.delete(Api.organization.removeUser(organizationId, userId))
        .then(({ body }) => {
            dispatch(removeUserSuccess(userId))
        });
}