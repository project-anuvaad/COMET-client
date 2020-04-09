import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';
import { push } from 'connected-react-router';

const moduleName = 'apiKeys';

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setApiKeys = keys => ({ 
    type: actionTypes.SET_API_KEYS,
    payload: keys,
})

export const setApiKeyFormOpen = open => ({
    type: actionTypes.SET_API_KEY_FORM_OPEN,
    payload: open,
})

export const setApiKeyForm = form => ({
    type: actionTypes.SET_API_KEY_FORM,
    payload: form,
})

export const resetApiKeyForm = () => ({
    type: actionTypes.RESET_API_KEY_FORM,
})


export const fetchApiKeys = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setLoading(true));
    requestAgent
        .get(Api.apiKeys.get({ organization: organization._id }))
        .then((res) => {
            console.log(res.body);
            const { apiKeys } = res.body;
            console.log('api keys', apiKeys);
            dispatch(setApiKeys(apiKeys));
            dispatch(setLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false));
        })
}

export const createApiKey = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { permissions, origins } = getState()[moduleName].apiKeyForm
    dispatch(setLoading(true))
    dispatch(setApiKeyFormOpen(false));
    requestAgent
        .post(Api.apiKeys.create(), { organization: organization._id, permissions, origins })
        .then((res) => {
            NotificationService.success('Created Successfully');
            console.log(res.body)
            dispatch(setLoading(false))
            dispatch(resetApiKeyForm());
            dispatch(fetchApiKeys())
        })
        .catch((err) => {
            dispatch(setLoading(false));
            dispatch(setApiKeyFormOpen(true));
            NotificationService.responseError(err);
        })
}



export const editPermissions = (organizationId, apikeyId, permissions) => (dispatch, getState) => {
    const { apiKeys } = getState()[moduleName];
    const apiKeyIndex = apiKeys.findIndex(k => k._id === apikeyId)
    requestAgent.patch(Api.organization.editPermissions(organizationId, apiKeys[apiKeyIndex].user._id), { permissions })
        .then(({ body }) => {
            apiKeys[apiKeyIndex].user.organizationRoles.find(o => o.organization === organizationId).permissions = permissions.slice();
            console.log('new permissions', permissions)
            dispatch(setApiKeys(apiKeys.slice()));
        })
        .catch(err => {
            console.log(err)
            NotificationService.responseError(err);
        })
}

export const deleteApiKey = (apikeyId) => (dispatch, getState) => {
    const { apiKeys } = getState()[moduleName];
    const apiKeyIndex = apiKeys.findIndex(k => k._id === apikeyId)
    requestAgent.delete(Api.apiKeys.delete(apikeyId))
        .then(({ body }) => {
            apiKeys.splice(apiKeyIndex, 1);
            dispatch(setApiKeys(apiKeys.slice()));
            NotificationService.success('Deleted successfully!');
        })
        .catch(err => {
            console.log(err)
            NotificationService.responseError(err);
        })
}

