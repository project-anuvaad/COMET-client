import * as actionTypes from '../actions/notification/types';


const INITIAL_STATE = {
    currentPage: 1,
    totalPagesCount: 1,
    notifications: [],
    loading: false,
    unreadCount: 0,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_NOTIFICATIONS:
            return { ...state, notifications: action.payload };
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_CURRENT_PAGE:
            return { ...state, currentPage: action.payload };
        case actionTypes.SET_TOTAL_PAGES_COUNT:
            return { ...state, totalPagesCount: action.payload };
        case actionTypes.SET_UNREAD_COUNT:
            return { ...state, unreadCount: action.payload };
        default:
            return state;
    }
}