import * as actionTypes from '../actions/authentication/types';

const storedToken = localStorage.getItem('authToken');

const INITIAL_STATE = {
    isAuthenticated: false,
    user: null,
    token: storedToken,
    errorMessage: null,
    signUpMessage: null,
    signUpSuccess: null,
    getUserDetailsLoading: false,
    signupLoading: false,
    resetPasswordLoading: false,
    subscribeToApiDocsLoading: false,
    apiKey: null,
    isSuperUser: false,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.LOGOUT:
            localStorage.removeItem('authToken');
            return { ...INITIAL_STATE };
        case actionTypes.SET_USER:
            return { ...state, user: action.payload };
        case actionTypes.AUTHENTICATION_SUCCESS:
            const { token, user } = action.payload;
            localStorage.setItem('authToken', token);

            return {
                ...state,
                isAuthenticated: true,
                errorMessage: null,
                token,
                user
            }

        case actionTypes.AUTHENTICATION_FAILED:
            const message = action.payload;
            return {
                ...state,
                errorMessage: message
            }

        case actionTypes.VALIDATE_TOKEN:
            const isValid = action.payload;
            const t = isValid ? state.token : null;

            return {
                ...state,
                isAuthenticated: isValid,
                token: t
            }

        case actionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                signUpSuccess: true,
                signUpMessage: 'You have successfully signed up. Please login to continue'
            }

        case actionTypes.SIGNUP_FAILED:
            return {
                ...state,
                signUpSuccess: false,
                signUpMessage: action.payload || 'Something went error, please try again later'
            }

        case actionTypes.SET_GET_USER_DETAILS_LOADING:
            return { ...state, getUserDetailsLoading: action.payload };
        case actionTypes.SET_SIGNUP_LOADING:
            return { ...state, signupLoading: action.payload };
        case actionTypes.SET_PASSWORD_RESET_LOADING:
            return { ...state, resetPasswordLoading: action.payload };
        case actionTypes.SET_USER_API_KEY:
            return { ...state, apiKey: action.payload };
        case actionTypes.SET_IS_SUPER_USER:
            return { ...state, isSuperUser: action.payload };
        case actionTypes.SET_SUBSCRIBE_TO_API_DOCS_LOADING:
            return { ...state, subscribeToApiDocsLoading: action.payload };
        default:
            return state;
    }
}