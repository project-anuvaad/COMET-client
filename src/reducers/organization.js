import * as actionTypes from '../actions/organization/types';

const INITIAL_STATE = {
    users: [],
    usersCounts: {
        accepted: 0,
        pending: 0,
    },
    organizationUsersTotalPages: 1,
    organizationUsersCurrentPage: 1,
    organization: null,
    createOrganizationLoading: false,
    permissionUpdateMessage: null,
    newOrganizationName: '',
    newOrganizationLogo: null,
    uploadLogoLoading: false,
    inviteUserSuccess: null,
    inviteUserMessage: null,
    removeUserSuccess: null,
    userGuidingTutorialModalOpen: false,
    userGuidingShowed: false,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_ORGANIZATION:
            return { ...state, organization: action.payload };
        case actionTypes.FETCH_USER_SUCCESS:
            return { ...state, users: action.payload };
        case actionTypes.SET_ORGANIZATION_USERS_COUNTS:
            return { ...state, usersCounts: action.payload };
        case actionTypes.SET_ORGANIZATION_USERS_TOTAL_PAGES:
            return { ...state, organizationUsersTotalPages: action.payload };
        case actionTypes.SET_ORGANIZATION_USERS_CURRENT_PAGE:
            return { ...state, organizationUsersCurrentPage: action.payload };
        case actionTypes.INVITE_USER_SUCCESS:
            return { ...state, inviteUserSuccess: true, users: [...state.users, action.payload] }
        case actionTypes.INVITE_USER_ERROR:
            return { ...state, inviteUserSuccess: false, inviteUserMessage: action.payload }
        case actionTypes.CHANGE_PERMISSION_SUCCESS:
            return { ...state, permissionUpdateMessage: 'Permission Changed Successfully' }
        case actionTypes.REMOVE_USER_SUCCESS:
            const users = state.users.filter((user) => {
                return user._id !== action.payload
            });
            return { ...state, users, removeUserSuccess: true };
        case actionTypes.SET_USER_GUIDING_TUTORIAL_MODAL_OPEN:
            return { ...state, userGuidingTutorialModalOpen: action.payload };
        case actionTypes.SET_USER_GUIDING_SHOWED:
            return { ...state, userGuidingShowed: action.payload };
        case actionTypes.SET_CREATE_ORGANIZATION_LOADING:
            return { ...state, createOrganizationLoading: action.payload };
        case actionTypes.SET_NEW_ORGANIZATION_NAME:
            return { ...state, newOrganizationName: action.payload };
        case actionTypes.SET_NEW_ORGANIZATION_LOGO:
            return { ...state, newOrganizationLogo: action.payload };
        case actionTypes.SET_UPLOAD_LOGO_LOADING:
            return { ...state, uploadLogoLoading: action.payload };
        default:
            return state;
    }
}