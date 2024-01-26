import { Dispatch } from "redux";

type StateGetter<TState = any> = () => TState;

(window as any).BrainMapSetting = (window as any).BrainMapSetting || {};
//exposing register settings to support legacy bu-settings
(window as any).BrainMapApp = {};
(window as any).BrainMapApp.registerSettings = function(response:any){
}

function idleLogout() {
}

function registerSettings(resolve:any) {

}

function initBootstrap(resolveStore: any) {

    return (dispatch: Dispatch<any>, getState: StateGetter) => {
        new Promise(function(resolve, reject) {
            registerSettings(resolve)
        // }).then(function(result) {
        //     return new Promise((resolve, reject) => {
        //         dispatch(loadInit(resolve));
        //     });
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
}
function authenticate() {
    //let deferred = new $.Deferred();
    return (dispatch: Dispatch<any>, getState: StateGetter) => {
    }

}

export const BrainMapApp = {
    initBootstrap,
    authenticate,
}
