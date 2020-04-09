import * as actionTypes from '../actions/video/types';
const UPLOADED_VIDEOS_KEY = 'vw_uploaded_videos_v2';
let initialUploadedVideos = [];

try {
    const uploadedVideos = window.localStorage.getItem(UPLOADED_VIDEOS_KEY);
    if (uploadedVideos && JSON.parse(uploadedVideos) && JSON.parse(uploadedVideos).length > 0) {
        initialUploadedVideos = JSON.parse(uploadedVideos)
    }
} catch(e) {
}

const INITIAL_STATE = {
    video: null,
    organizationVideos: {
        status: 'done',
        videosList: [],
        tabs: [],
        activeTabIndex: 0,
    },
    fetchVideoState: 'done',
    fetchVideoError: '',

    uploadProgress: 0,
    uploadState: 'done',
    uploadError: '',
    convertStages: {
        stages: [],
        activeStageIndex: null,
    },
    uploadVideoForm: {
        title: '',
        numberOfSpeakers: 1,
        langCode: 'en-US',
        video: null,
        backgroundMusic: null,
        fileContent: null,
        withSubtitle: false,
        subtitle: null,
        mode: 'view',
        videos: [],
        subtitles: [],
        activeTabIndex: 0,
    },
    uploadedVideos: initialUploadedVideos,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_UPLOADED_VIDEOS:
            window.localStorage.setItem(UPLOADED_VIDEOS_KEY, JSON.stringify(action.payload));
            return { ...state, uploadedVideos: action.payload };
        case actionTypes.UPLOAD_VIDEO_PROGRESS:
            return { ...state, uploadProgress: action.payload };
        case actionTypes.UPLOAD_VIDEO_LOADING:
            return { ...state, uploadState: 'loading', uploadProgress: 0, uploadError: '', video: null, };
        case actionTypes.UPLOAD_VIDEO_SUCCESS:
            return { ...state, uploadState: 'done', video: action.payload, uploadProgress: 0, uploadError: '' };
        case actionTypes.UPLOAD_VIDEO_FAILED:
            return { ...state, uploadState: 'failed', uploadProgress: 0, uploadError: action.payload };
        case actionTypes.FETCH_VIDEO_LOADING:
            return { ...state, fetchVideoState: 'loading', video: null };
        case actionTypes.FETCH_VIDEO_SUCCESS:
            return { ...state, fetchVideoState: 'done', video: action.payload };
        case actionTypes.FETCH_VIDEO_FAILED:
            return { ...state, fetchVideoState: 'failed', fetchVideoError: action.payload };
        case actionTypes.SET_STAGES:
            return { ...state, convertStages: action.payload };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_LOADING:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'loading ' } };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_FAILED:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'failed ' } };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_SUCCESS:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'done', videosList: action.payload } };
        case actionTypes.SET_ORGANIZATION_VIDEOS_ACTIVE_TAB_INDEX:
            return { ...state, organizationVideos: { ...state.organizationVideos, activeTabIndex: action.payload } };
        case actionTypes.SET_ORGANIZATION_VIDEOS_TABS:
            return { ...state, organizationVideos: { ...state.organizationVideos, tabs: action.payload } };
        case actionTypes.SET_UPLOAD_VIDEO_FORM:
            return { ...state, uploadVideoForm: action.payload };
        case actionTypes.RESET_UPLOAD_VIDEO_FORM:
            console.log('reset upload video form', INITIAL_STATE.uploadVideoForm)
            return { ...state, uploadVideoForm: { ...INITIAL_STATE.uploadVideoForm } };
        case actionTypes.RESET:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
}