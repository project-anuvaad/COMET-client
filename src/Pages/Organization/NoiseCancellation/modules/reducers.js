import * as actionTypes from './types';

const INITIAL_STATE = {
    loading: false,
    articles: [],
    videos: [],
    searchFilter: '',
    currentPageNumber: 1,
    totalPagesCount: 1,
    uploadProgress: 0,
    uploadState: '',
    uploadError: '',
    uploadFormOpen: false,
    uploadVideoLoading: false,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ARTICLES:
            return { ...state, articles: action.payload };
        case actionTypes.SET_TOTAL_PAGES_COUNT:
            return { ...state, totalPagesCount: action.payload };
        case actionTypes.SET_CURRENT_PAGE_NUMBER:
            return { ...state, currentPageNumber: action.payload };
        case actionTypes.SET_SEARCH_FILTER:
            return { ...state, searchFilter: action.payload };
        case actionTypes.SET_UPLOAD_VIDEO_LOADING:
            return { ...state, uploadVideoLoading: action.payload };
        case actionTypes.SET_VIDEOS:
            return { ...state, videos: action.payload };
        case actionTypes.SET_VIDEO_STATUS_FILTER:
            return { ...state, videoStatusFilter: action.payload };
        case actionTypes.SET_UPLOAD_FORM_OPEN:
            return { ...state, uploadFormOpen: action.payload };
        case actionTypes.UPLOAD_VIDEO_PROGRESS:
            return { ...state, uploadProgress: action.payload };
        case actionTypes.UPLOAD_VIDEO_LOADING:
            return { ...state, uploadState: 'loading', uploadProgress: 0, uploadError: '', video: null, };
        case actionTypes.UPLOAD_VIDEO_SUCCESS:
            return { ...state, uploadState: 'done', uploadProgress: 0, uploadError: '' };
        case actionTypes.UPLOAD_VIDEO_FAILED:
            return { ...state, uploadState: 'failed', uploadProgress: 0, uploadError: action.payload };

        default:
            return state;
    }
}