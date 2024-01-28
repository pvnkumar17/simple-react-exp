import querySerializer from 'query-string';
import { redirect } from 'redux-first-router';
// The purpose of the below options is to demonstrate auth filtering.
// onBeforeChange fires before going to a new route, and you can
// redirect if certian conditions aren't met.

export default {
  querySerializer,
  onBeforeChange: (dispatch, getState, action) => {
    const {
        location: { routesMap },
      } = getState();
  
    // Capturing initial time of any page (Components) load
    window.pageLoadStartTime = new Date().getTime();
    const isLogin = getState().meDetails.meState.LOGGED_IN;

    if (isLogin) {
      const redirectAction = redirect({ type: 'HOME' });
      dispatch(redirectAction);
    }
  },
  onAfterChange: (dispatch, getState) => {
    window.scrollTo(0, 0);
  },
};