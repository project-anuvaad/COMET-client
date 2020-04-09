import * as actionTypes from './types';

import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { push } from 'connected-react-router';
import routes from '../../shared/routes';
import NotificationService from '../../shared/utils/NotificationService';

const moduleName = 'notification';

const setNotifications = notifications => ({
    type: actionTypes.SET_NOTIFICATIONS,
    payload: notifications,
})

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setCurrentPage = page => ({
    type: actionTypes.SET_CURRENT_PAGE,
    payload: page,
})

const setTotalPagesCount = (count) => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: count,
})

const setUnreadCount = count => ({
    type: actionTypes.SET_UNREAD_COUNT,
    payload: count,
})

export const fetchNotifications = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { currentPage } = getState()[moduleName];

    dispatch(setLoading(true))
    requestAgent
    .get(Api.notification.getNotifications({ organization: organization._id, page: 1 }))
    .then((res) => {
        const { notifications, pagesCount } = res.body;
        dispatch(setTotalPagesCount(pagesCount))
        dispatch(setCurrentPage(1));
        dispatch(setNotifications(notifications))
        dispatch(setLoading(false))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLoading(false))
    })
}

export const fetchUnreadCount = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    requestAgent
    .get(Api.notification.getUnreadCount({ organization: organization._id }))
    .then((res) => {
        const { count } = res.body;
        dispatch(setUnreadCount(count))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })   
}

export const loadMore = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { currentPage } = getState()[moduleName];

    dispatch(setLoading(true))
    requestAgent
    .get(Api.notification.getNotifications({ organization: organization._id, page: currentPage + 1 }))
    .then((res) => {
        const { notifications: newNotifications, pagesCount } = res.body;
        const { notifications } = getState()[moduleName];
        const finalNotifications = notifications.concat(newNotifications);
        dispatch(setCurrentPage(currentPage + 1))
        dispatch(setNotifications(finalNotifications))
        dispatch(setTotalPagesCount(pagesCount))
        dispatch(setLoading(false))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLoading(false))
    })
}


export const setNotificationsRead = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    requestAgent
    .post(Api.notification.setNotificationsRead(), { organization: organization._id })
    .then((res) => {
        dispatch(setUnreadCount(0));
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}


export const respondToTranslationInvitation = (notificationId, organizationId, articleId, status, inviteToken, email) => (dispatch, getState) => {
    requestAgent.post(Api.invitations.respondToTranslationInvitation(articleId), { inviteToken, status, email })
    .then((res) => {
        const { speakerNumber } = res.body;
        const { notifications } = getState()[moduleName];
        notifications.find((n) => n._id === notificationId).status = status;
        dispatch(setNotifications(notifications.slice()))
        if (status === 'accepted') {
            NotificationService.success(`You can start now translating the video`);
            dispatch(push(routes.translationArticle(articleId) + `?speakerNumber=${speakerNumber}&finishDateOpen=true`));
        } else {
            NotificationService.success(`Your response has been recorded`);
        }
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        // dispatch(push(routes.home()))
    })
}
