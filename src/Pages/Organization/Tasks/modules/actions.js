import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';
import { push } from 'connected-react-router';

const moduleName = 'organizationTasks';

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setArticles = articles => ({
    type: actionTypes.SET_ARTICLES,
    payload: articles,
})

const setTotalPagesCount = count => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: count,
})

const setVideos = videos => ({
    type: actionTypes.SET_VIDEOS,
    payload: videos,
})

export const setSearchFilter = searchFilter => ({
    type: actionTypes.SET_SEARCH_FILTER,
    payload: searchFilter,
})

export const setVideoStatusFilter = statuses => ({
    type: actionTypes.SET_VIDEO_STATUS_FILTER,
    payload: statuses,
})

export const setCurrentPageNumber = pageNumber => ({
    type: actionTypes.SET_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const fetchUserTasks = () => (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setArticles([]))
    const { authentication, organization } = getState();
    const {
        searchFilter,
        currentPageNumber
    } = getState()[moduleName];
    requestAgent
        .get(Api.article.getUserTranslations({
            organization: organization.organization._id,
            page: currentPageNumber,
            user: authentication.user._id,
            search: searchFilter,
        }))
        .then((res) => {
            const { articles, pagesCount } = res.body;
            dispatch(setArticles(articles));
            dispatch(setLoading(false))
            if (pagesCount) {
                dispatch(setTotalPagesCount(pagesCount));
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false))
        })
}

export const fetchUserReviews = () => (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setVideos([]))
    const { authentication, organization } = getState();
    const {
        searchFilter,
        currentPageNumber,
        videoStatusFilter
    } = getState()[moduleName];
    requestAgent
        .get(Api.video.getVideos({
            organization: organization.organization._id,
            page: currentPageNumber,
            search: searchFilter,
            reviewers: authentication.user._id,
            status: videoStatusFilter.join(',')
        }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setVideos(videos));
            dispatch(setLoading(false))
            if (pagesCount) {
                dispatch(setTotalPagesCount(pagesCount));
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false))
        })
}


export const rereviewVideo = video => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setLoading(true));
    requestAgent
        .post(Api.video.transcribeVideo(video._id), { organization: organization._id })
        .then((res) => {
            console.log(res);
            dispatch(push(routes.convertProgress(video._id)));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false));
        })
}