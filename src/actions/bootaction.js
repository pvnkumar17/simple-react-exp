
import { CallApi } from '../services/apiCalls';
import { getUserDetails } from '../services/meService';
import { loadInit, handleRefreshSuccess } from './meAction';
window.BrainMapSetting = window.BrainMapSetting || {};
//exposing register settings to support legacy bu-settings
window.BrainMapApp = {};
window.BrainMapApp.registerSettings = function(response){
}

function idleLogout() {
}

function registerSettings(resolve) {
    return resolve();
}

function initBootstrap(resolveStore) {

    return (dispatch, getState) => {
        new Promise(function(resolve, reject) {
            registerSettings(resolve)
        }).then(function(result) {
            return new Promise((resolve, reject) => {
                dispatch(loadInit(resolve));
            });
        }).then(function(result) {
            dispatch(authenticate());
        // }).then(function() {
        //     const me = getState().meDetails && getState().meDetails.meState;
        //     const isLoggedIn = me.LOGGED_IN;
        //     isLoggedIn && idleLogout();
        })
        .then(function() {
            if (resolveStore)
                return resolveStore();
        });
    }
};

function setLoginData(data) {
    return (dispatch, getState) => {
        new Promise(function(resolve, reject) {
            handleRefreshSuccess(data, dispatch, getState);
            dispatch(loadInit(resolve));
        })
        //}).then(function(result) {
            //dispatch({ type: 'DASHBOARD', payload: { filter: {} } });
            }
        //);
   // }
};

function authenticate() {
    //let deferred = new $.Deferred();
    return (dispatch, getState) => {
    }

};

// function setLoginData(data) {
//     return (dispatch, getState) => {
//         new Promise(function(resolve, reject) {
//             handleRefreshSuccess(data, dispatch, getState, resolve)
//         }).then(function(result) {
//             dispatch({ type: 'DASHBOARD', payload: { filter: {} } });
//             }
//         );
//     }
// }

export const BrainMapApp = {
    initBootstrap,
    authenticate,
    setLoginData,
}
