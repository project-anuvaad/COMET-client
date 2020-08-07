import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { generateConvertStages, removeExtension } from '../../shared/utils/helpers';
import NotificationService from '../../shared/utils/NotificationService';
import { push } from 'connected-react-router';
import routes from '../../shared/routes';
import asyncSeries from 'async/series';

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

const fetchVideoLoading = () => ({
    type: actionTypes.FETCH_VIDEO_LOADING,
})

const fetchVideoSuccess = (video) => ({
    type: actionTypes.FETCH_VIDEO_SUCCESS,
    payload: video,
})

const fetchVideoFailed = (err) => ({
    type: actionTypes.FETCH_VIDEO_FAILED,
    payload: err,
})

const setStages = (stages, activeStageIndex) => ({
    type: actionTypes.SET_STAGES,
    payload: { stages, activeStageIndex },
})

export const setUploadVideoForm = uploadVideoForm => ({
    type: actionTypes.SET_UPLOAD_VIDEO_FORM,
    payload: uploadVideoForm,
})

export const setUploadedVideos = videos => ({
    type: actionTypes.SET_UPLOADED_VIDEOS,
    payload: videos,
})

export const fetchUploadedVideos = () => (dispatch, getState) => {
    const videos = getState().video.uploadedVideos || [];
    const fetchFuncArray = [];
    videos.filter( v => v && v._id ).forEach(v => {
        fetchFuncArray.push(cb => {
            requestAgent.get(Api.video.getVideoById(v._id))
            .then(res => {
                cb(null, res.body)
            }).catch(err => {
                console.log(err);
                cb()
            })
        })
    })

    asyncSeries(fetchFuncArray, (err, result) => {
        if (result && result.length > 0) {
            result = result.filter(r => r)
            const newVideos = getState().video.uploadedVideos || [];
            result.forEach(v => {
                const videoIndex = newVideos.filter(v => v && v._id).findIndex(vid => v._id === vid._id);
                if (videoIndex !== -1) {
                    newVideos[videoIndex] = v;
                }
            });
            dispatch(setUploadedVideos(newVideos.filter(v => v).slice()));
        }
    })
}

export const reset = () => ({
    type: actionTypes.RESET,
})

export const resetUploadVideoForm = () => ({
    type: actionTypes.RESET_UPLOAD_VIDEO_FORM
})

export const setMultiUploadMode = mode => ({
    type: actionTypes.SET_MULTI_UPLOAD_MODE,
    payload: mode,
})

export const abortVideoUpload = (videoIndex) => (dispatch, getState) => {
    const { uploadVideoForm } = getState().video;
    const { videos } = uploadVideoForm;
    videos[videoIndex].aborted = true;
    dispatch(setUploadVideoForm({ ...uploadVideoForm, videos }));   
}

export const abortAllVideoUploads = () => (dispatch, getState) => {
    const { uploadVideoForm } = getState().video;
    const { videos } = uploadVideoForm;
    videos.forEach(v => {
        v.aborted = true;
    })
    dispatch(setUploadVideoForm({ ...uploadVideoForm, videos })); 
    NotificationService.info('Upload canceled');
}

export const uploadMultiVideos = ({ organization }) => (dispatch, getState) => {
    const { uploadVideoForm } = getState().video;
    const { videos } = uploadVideoForm;

    videos.forEach(v => {
        v.started = true;
    })
    dispatch(setUploadVideoForm({ ...uploadVideoForm, videos: videos.slice() }));
    dispatch(uploadVideoLoading());
    const uploadVideoFuncArray = [];
    videos.forEach((video, index) => {
        uploadVideoFuncArray.push((cb) => {
            const { numberOfSpeakers, langCode, content, name, folder } = video;
            const req = requestAgent
            .post(Api.video.uploadVideo())
            .field('title', name)
            .field('numberOfSpeakers', numberOfSpeakers)
            .field('langCode', langCode)
            .field('organization', organization || '')
            .field('folder', folder || '')
            .attach('video', content)
            if (video.subtitle) {
                req.attach('subtitle', video.subtitle);
            }

    
            req.on('progress', function (e) {
                if (e.percent) {
                    const { uploadVideoForm } = getState().video;
                    const { videos } = uploadVideoForm;
                    dispatch(uploadVideoProgress(e.percent))
                    video.progress = e.percent;
                    dispatch(setUploadVideoForm({ ...uploadVideoForm, videos }));
                    if (videos[index].aborted) {
                        return req.abort()
                    }
                }
            })
            .then(res => {
                video.percent = 100;
                dispatch(setUploadVideoForm({ ...uploadVideoForm, videos }));
                cb(null, res.body);
            })
            .catch(err => {
                if (err.code === 'ABORTED') {
                    return cb();
                }
                const reason = err.response ? err.response.text : 'Something went wrong';
                cb(reason);
            })
        })
    })
    asyncSeries(uploadVideoFuncArray, (err, result) => {
        if (err) {
            dispatch(uploadVideoFailed(err));
        } else {
            dispatch(uploadVideoDone(result[0]));
        }

        const { uploadVideoForm } = getState().video;
        dispatch(setUploadVideoForm({ ...uploadVideoForm, videos: [] }));
        if (result && result.length > 0) {
            result = result.filter(r => r);
            dispatch(setUploadedVideos(result.reverse()));
        } else {
            dispatch(setUploadedVideos([]));
        }
        if (result.length === 1) {
            if (result[0].subtitle) {
                const video = result[0];
                NotificationService.info(`The Video ${video.title} has moved directly to Proofreading stage since it has subtitles`, '', 7000)
            }
        }
        // dispatch(resetUploadVideoForm());
    })
}

export const uploadVideo = ({ title, numberOfSpeakers, video, langCode, organization, subtitle, backgroundMusic }) => (dispatch, getState) => {
    const { uploadVideoForm } = getState().video;
    dispatch(uploadVideoLoading());
    const req = requestAgent
        .post(Api.video.uploadVideo())
        .field('title', title)
        .field('numberOfSpeakers', numberOfSpeakers)
        .field('langCode', langCode)
        .field('organization', organization || '')
        .attach('video', video)
        if (subtitle) {
            req.attach('subtitle', subtitle);
        }
        if (backgroundMusic) {
            req.attach('backgroundMusic', backgroundMusic);
        }

        req.on('progress', function (e) {
            dispatch(uploadVideoProgress(e.percent))
        })
        .then(res => {
            dispatch(uploadVideoDone(res.body));
            dispatch(resetUploadVideoForm());
        })
        .catch(err => {
            const reason = err.response ? err.response.text : 'Something went wrong';
            dispatch(uploadVideoFailed(reason));
        })
}

export const fetchVideoById = videoId => dispatch => {
    dispatch(fetchVideoLoading());
    requestAgent
        .get(Api.video.getVideoById(videoId))
        .then(res => {
            const video = res.body;
            const stages = generateConvertStages();
            let activeStageIndex = 0;
            switch (video.status) {
                case 'proofreading':
                    stages[0].completed = true;
                    stages[1].active = true;
                    activeStageIndex = 1;
                    break;
                case 'converting':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].active = true;
                    activeStageIndex = 2;
                    break;
                case 'done':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].completed = true;
                    stages[0].active = true;
                    stages[1].active = true;
                    stages[2].active = true;
                    activeStageIndex = 3;
                    break;
                default:
                    stages[0].active = true;
            }
            dispatch(fetchVideoSuccess(video));
            dispatch(setStages(stages, activeStageIndex));
        })
        .catch(err => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            dispatch(fetchVideoFailed(reason));
        })
}

export const convertVideoToArticle = (videoId, articleId, toEnglish) => (dispatch, getState) => {
    requestAgent
        .post(Api.video.convertVideo(videoId), { articleId, toEnglish })
        .then(res => {
            console.log(res);
            const { stages } = getState().video.convertStages;
            stages[0].completed = true;
            stages[1].completed = true;
            stages[2].active = true;
            dispatch(push(`${routes.organziationReview()}?activeTab=proofread`))
            dispatch(setStages(stages, 2));
        })
        .catch((err) => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            NotificationService.error(reason);
        })
}

export const fetchOrganizationVideos = organizationId => dispatch => {
    dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_LOADING });
    requestAgent
    .get(Api.video.getOrganizationVideos(organizationId))
    .then((res) => {
        const { videos } = res.body;
        dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_SUCCESS, payload: videos });
    })
    .catch((err) => {
        NotificationService.responseError(err);
        dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_FAILED });
    })
}

export const setOrganizationVideosActiveTabIndex = index => ({
    type: actionTypes.SET_ORGANIZATION_VIDEOS_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setOrganizationVideosTabs = tabs => ({
    type: actionTypes.SET_ORGANIZATION_VIDEOS_TABS,
    payload: tabs,
})