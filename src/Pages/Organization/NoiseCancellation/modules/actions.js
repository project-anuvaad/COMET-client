import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';
import { push } from 'connected-react-router';

const moduleName = 'noiseCancellationVideos';

const uploadVideoLoading = () => ({
    type: actionTypes.UPLOAD_VIDEO_LOADING
});

const uploadVideoProgress = progress => ({
    type: actionTypes.UPLOAD_VIDEO_PROGRESS,
    payload: progress,
})

const uploadVideoDone = result => ({
    type: actionTypes.UPLOAD_VIDEO_SUCCESS,
    payload: result,
})

const uploadVideoFailed = (error) => ({
    type: actionTypes.UPLOAD_VIDEO_FAILED,
    payload: error,
})

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setTotalPagesCount = count => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: count,
})

const setVideos = videos => ({
    type: actionTypes.SET_VIDEOS,
    payload: videos,
})

export const setUploadVideoLoading = loading => ({
    type: actionTypes.SET_UPLOAD_VIDEO_LOADING,
    payload: loading,
})

export const setUploadFormOpen = open => ({
    type: actionTypes.SET_UPLOAD_FORM_OPEN,
    payload: open,
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


export const fetchVideos = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { searchFilter, currentPageNumber } = getState()[moduleName];

    console.log('getting video from fetch')
    dispatch(setLoading(true));
    requestAgent
        .get(Api.noiseCancellationVideos.getVideos({ organization: organization._id, page: currentPageNumber, search: searchFilter }))
        .then((res) => {
            console.log(res.body);
            const { noiseCancellationVideos, pagesCount, totalCount } = res.body;
            dispatch(setVideos(noiseCancellationVideos));
            dispatch(setTotalPagesCount(pagesCount || 1));
            dispatch(setLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false));
        })
}

export const uploadVideo = (fileContent, title) => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(uploadVideoProgress(0))
    dispatch(setUploadVideoLoading(true))
    const req = requestAgent
        .post(Api.noiseCancellationVideos.uploadVideo())
        .field('title', title)
        .field('organization', organization._id)
        .attach('video', fileContent);
    req.on('progress', function (e) {
        if (e.percent) {
            dispatch(uploadVideoProgress(e.percent))
        }
    })
        .then((res) => {
            NotificationService.success('Uploaded Successfully');
            dispatch(uploadVideoProgress(0))
            dispatch(setUploadVideoLoading(false))
            dispatch(fetchVideos());
            dispatch(setUploadFormOpen(false))
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(uploadVideoFailed());
            dispatch(setUploadVideoLoading(false))
            dispatch(uploadVideoProgress(0))
            dispatch(setUploadFormOpen(false))
        })
}
