import * as actionTypes from './types';

const INITIAL_STATE = {
    loading: false,
    apiKeys: [],
    apiKeyFormOpen: false,
    apiKeyForm: {
        origins: [],
        permissions: [],
        keyType: 'platform',
    }
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_API_KEYS:
            return { ...state, apiKeys: action.payload };
        case actionTypes.SET_API_KEY_FORM:
            return { ...state, apiKeyForm: action.payload };
        case actionTypes.SET_API_KEY_FORM_OPEN:
            return { ...state, apiKeyFormOpen: action.payload };
        case actionTypes.RESET_API_KEY_FORM:
            return {
                ...state,
                apiKeyForm: {
                    origins: [],
                    permissions: [],
                }
            };
        default:
            return state;
    }
}