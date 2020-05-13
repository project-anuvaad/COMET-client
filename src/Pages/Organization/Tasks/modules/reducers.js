import * as actionTypes from './types';

const INITIAL_STATE = {
    loading: false,
    articles: [],
    videos: [],
    searchFilter: '',
    currentPageNumber: 0,
    totalPagesCount: 1,
    videoStatusFilter: ['proofreading', 'converting'],
    fetchFromAllOrganizations: false,
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
        case actionTypes.SET_VIDEOS:
            return { ...state, videos: action.payload };
        case actionTypes.SET_VIDEO_STATUS_FILTER:
            return { ...state, videoStatusFilter: action.payload };
        case actionTypes.SET_FETCH_FROM_ALL_ORGANIZATIONS:
            return { ...state, fetchFromAllOrganizations: action.payload };
        default:
            return state;
    }
}