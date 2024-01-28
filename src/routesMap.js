import { BrainMapApp } from './actions/bootaction';

export const getUrlParameter =  (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(Location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.routeSettings = {};

const routesMap = {
  HOME: {
    path: `/`,
    thunk: async (dispatch, getState) => {
      const isLogin = getState().meDetails.meState.LOGGED_IN;
      let refreshToken = getUrlParameter('redirect-token') || null;
      if (refreshToken) {
        refreshToken = decodeURIComponent(refreshToken);
        sessionStorage.setItem('apiRefreshToken', refreshToken);
        BrainMapApp.initBootstrap(null);
        dispatch({ type: 'HOME' });
        return;
      } else {
        !isLogin ? dispatch({ type: 'LOGIN' }) : dispatch({ type: 'HOME' });
      }
    },
  },
  DASHBOARD: {
    path: `/dashboard`,
  },
  LOGIN: `/login`,

};

window.routeSettings.routesMap = routesMap

export default routesMap;