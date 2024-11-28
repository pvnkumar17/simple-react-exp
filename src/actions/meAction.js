
import constants from '../common/constants';
import { BrainMapApp } from './bootaction';

import {
    getUserDetails,
} from '../services/meService';
let accessToken = null;

let meState = {
    AUTHENTICATING: false,
    OPENID_CONFIG: false,
    LOGGED_IN: false,
    USER_DETAILS: false,
    HAS_PERMISSIONS: false,
    HAS_CUSTOMERS: false,
    HAS_RESOURCE_RIGHTS: false,
    FETCHING_PERMISSIONS: false,
    FETCHING_RESOURCE_RIGHTS: false,
    LOGIN_ERROR: false,
    APPLY_ONBOARDING: false
}

export function meStateUpdate(data) {
    return { type: constants.ME_STATE_UPDATE, data };
}

export function stateUpdate(state) {
    state = state || {};
    return (dispatch, getState) => {
        Object.assign(meState, state);
        dispatch(meStateUpdate(meState));

    }
}
export function loadInit(resolve) {
    return (dispatch, getState) => {
        dispatch(stateUpdate({ AUTHENTICATING: true }));
        initializeToken(dispatch, getState, resolve)
    }
}

function initializeToken(dispatch, getState, resolve) {
    initializeFromStorage();
    if (accessToken) {
        getUserDetails().then(data => {
            dispatch(userInfoSucess(data));
            //dispatch({ type: 'DASHBOARD', payload: { filter: {} } });
        }).catch(error => {
            throw (error);
        });
        dispatch({ type: 'DASHBOARD', payload: { filter: {} } });
    } else {
        dispatch({ type: 'LOGIN' });
    };
    return resolve();
}

export function handleRefreshSuccess(response, dispatch, resolve) {
    dispatch(stateUpdate({ LOGGED_IN: true, AUTHENTICATING: false }));
    setUser(response);
    return resolve();
}

function handleRefreshError(dispatch, getState) {
    //to do logout on refresh token expire
    // let refreshToken = store.refreshToken;
    dispatch(stateUpdate({ LOGGED_IN: false, AUTHENTICATING: false }));
    removeTokens();

}

function removeTokens() {
    localStorage.removeItem('apiToken');
    accessToken = null;

}

function setUser(res) {
    if (res) {
        accessToken = res.accessToken;
        localStorage.setItem('apiToken', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user));
    }
    //return { type: constants.REFRESH_TOKEN_SUCCESS, refreshTokenStorage };

}

function initializeFromStorage() {
    // grab existing state from local storage
    // restore the me stores' state
    accessToken = localStorage.getItem('apiToken');
}

export function userInfoSucess(data) {
    return { type: constants.USER_INFO_SUCCESS, data };
}
export function deletedNodes(data) {
    return { type: constants.DELETED_NODES, data };
}

export function editorInfoUpdate(data) {
    return { type: constants.EDITOR_INFO_UPDATE, data };
}
export function mindMapUpdate(data) {
    return { type: constants.MIND_MAP_UPDATE, data };
}
