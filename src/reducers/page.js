import { NOT_FOUND } from 'redux-first-router';

export default (state = 'LOGIN', action= {}) =>
   components[action.type] || state;

const components = {
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  [NOT_FOUND]: 'login'
};