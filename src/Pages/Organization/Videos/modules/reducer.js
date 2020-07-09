import * as actionTypes from './types';

const INITIAL_STATE = {
    activeTabIndex: 0,
    videos: [],
    videosLoading: false,
    currentPageNumber: 1,
    totalPagesCount: 1,
    languageFilter: '',
    searchFilter: '',
    addHumanVoiceModalVisible: false,
    addMultipleHumanVoiceModalVisible: false,
    selectedVideo: null,
    selectedCount: 0,
    translatedArticles: [],
    singleTranslatedArticle: null,
    singleTranslatedArticleActiveTab: 'all',
    singleTranslatedArticleStageFilter: [],
    translationsCount: {},
    videoStatusFilter: [],
    translateOnWhatsappActive: false,
    videosCounts: {
        transcribe: 0,
        proofread: 0,
        completed: 0,
        cutting: 0,
        total: 0,
    },
    openedFolder: null,
    folders: [],
    foldersLoading: false,
}

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_VIDEOS:
            return { ...state, videos: action.payload };
        case actionTypes.SET_VIDEO_LOADING:
            return { ...state, videosLoading: action.payload };
        case actionTypes.SET_ACTIVE_TAB_INDEX:
            return { ...state, activeTabIndex: action.payload };
        case actionTypes.SET_LANGUAGE_FILTER:
            return { ...state, languageFilter: action.payload };
        case actionTypes.SET_ADD_HUMAN_VOICE_MODAL_VISIBLE:
            return { ...state, addHumanVoiceModalVisible: action.payload };
        case actionTypes.SET_ADD_MULTIPLE_HUMAN_VOICE_MODAL_VISIBLE:
            return { ...state, addMultipleHumanVoiceModalVisible: action.payload };
        case actionTypes.SET_TRANSLATE_ON_WHATSAPP_ACTIVE:
            return { ...state, translateOnWhatsappActive: action.payload };
        case actionTypes.SET_SELECTED_VIDEO:
            return { ...state, selectedVideo: action.payload };
        case actionTypes.SET_TRANSLATED_ARTICLES:
            return { ...state, translatedArticles: action.payload };
        case actionTypes.SET_CURRENT_PAGE_NUMBER:
            return { ...state, currentPageNumber: action.payload };
        case actionTypes.SET_TOTAL_PAGES_COUNT:
            return { ...state, totalPagesCount: action.payload };
        case actionTypes.SET_VIDEO_STATUS_FILTER:
            return { ...state, videoStatusFilter: action.payload };
        case actionTypes.SET_VIDEO_SEARCH_FILTER:
            return { ...state, searchFilter: action.payload };
        case actionTypes.SET_SINGLE_TRANSLATED_ARTICLE:
            return { ...state, singleTranslatedArticle: action.payload };
        case actionTypes.SET_SINGLE_TRANSLATED_ARTICLE_ACTIVE_TAB:
            return { ...state, singleTranslatedArticleActiveTab: action.payload };
        case actionTypes.SET_SINGLE_TRANSLATED_ARTICLE_STAGE_FILTER:
            return { ...state, singleTranslatedArticleStageFilter: action.payload };
        case actionTypes.SET_TRANSLATIONS_COUNT:
            return { ...state, translationsCount: action.payload };
        case actionTypes.SET_VIDEOS_COUNTS:
            return { ...state, videosCounts: action.payload };
        case actionTypes.SET_SELECTED_COUNT:
            return { ...state, selectedCount: action.payload };
        case actionTypes.SET_OPENED_FOLDER:
            return { ...state, openedFolder: action.payload };
        case actionTypes.SET_FOLDERS:
            return { ...state, folders: action.payload };
        case actionTypes.SET_FOLDERS_LOADING:
            return { ...state, foldersLoading: action.payload };
        default:
            return state;
    }
}

