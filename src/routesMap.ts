import { BrainMapApp } from './actions/bootAction'
import { Dispatch } from "redux";

type StateGetter<TState = any> = () => TState;

export const getUrlParameter =  (name: string) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec((Location as any).search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

(window as any).routeSettings = {};

const routesMap = {
  HOME: {
    path: `/apps/`,
    thunk: async (dispatch: Dispatch<any>, getState: StateGetter) => {
      const isLogin = getState().meDetails.meState.LOGGED_IN;
      let refreshToken = getUrlParameter('redirect-token') || null;
      if (refreshToken) {
        refreshToken = decodeURIComponent(refreshToken);
        sessionStorage.setItem('apiRefreshToken', refreshToken);
        BrainMapApp.initBootstrap(null);
        dispatch({ type: 'DASHBOARD' });
        return;
      } else {
        !isLogin ? dispatch({ type: 'LOGIN' }) : dispatch({ type: 'DASHBOARD' });
      }
    },
  },

  DASHBOARD: {
    path: `/apps/dashboard`,
    thunk: async (dispatch: Dispatch<any>, getState: StateGetter) => {},
  },
  LOGIN: `/apps/login`,

};

((window as any).routeSettings as any).routesMap = routesMap

export default routesMap;
