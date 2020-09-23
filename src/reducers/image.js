import * as actionTypes from "../actions/image/types";

const INITIAL_STATE = {
  images: [],
  currentPageNumber: 1,
  totalPagesCount: 1,
  imagesLoading: false,
  searchFilter: "",
  status: "",
  uploadImageForm: {
    activeTabIndex: 0,
    images: [],
  },
  image: null,
  translationActiveTabIndex: 0,
  imageTranslationExports: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_UPLOAD_IMAGE_FORM:
      return { ...state, uploadImageForm: action.payload };
    case actionTypes.SET_UPLOAD_ACTIVE_TAB_INDEX:
      return { ...state, uploadActiveTabIndex: action.payload };
    case actionTypes.RESET_UPLOAD_IMAGE_FORM:
      return { ...state, uploadImageForm: INITIAL_STATE.uploadImageForm };
    case actionTypes.SET_IMAGES:
      return { ...state, images: action.payload };
    case actionTypes.SET_TOTAL_PAGES_COUNT:
      return { ...state, totalPagesCount: action.payload };
    case actionTypes.SET_CURRENT_PAGE_NUMBER:
      return { ...state, currentPageNumber: action.payload };
    case actionTypes.SET_IMAGES_LOADING:
      return { ...state, imagesLoading: action.payload };
    case actionTypes.SET_SEARCH_FILTER:
      return { ...state, searchFilter: action.payload };
    case actionTypes.SET_IMAGE:
      return { ...state, image: action.payload };
    case actionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case actionTypes.SET_TRANSLATION_ACTIVE_TAB_INDEX:
      return { ...state, translationActiveTabIndex: action.payload };
    case actionTypes.SET_IMAGE_TRANSLATION_EXPORTS:
      return { ...state, imageTranslationExports: action.payload };

    default:
      return state;
  }
}
