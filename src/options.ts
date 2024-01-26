import querySerializer from 'query-string';
import { redirect } from 'redux-first-router';
import { Dispatch } from "redux";

type StateGetter<TState = any> = () => TState;
// The purpose of the below options is to demonstrate auth filtering.
// onBeforeChange fires before going to a new route, and you can
// redirect if certian conditions aren't met.

export default {
  querySerializer,
  onBeforeChange: (dispatch: Dispatch<any>, getState: StateGetter) => {

    // Capturing initial time of any page (Components) load
    (window as any).pageLoadStartTime = new Date().getTime();
    const isLogin = getState().meDetails.meState.LOGGED_IN;

    if (!isLogin) {
      const redirectAction = redirect({ type: 'LOGIN' });
      dispatch(redirectAction);
    }
  },
  onAfterChange: (dispatch: Dispatch<any>, getState: StateGetter) => {
    window.scrollTo(0, 0);
  },
};
