import initialState from './initialState';


export default function meReducer (state = initialState.meData, action) {
  switch (action.type) {
    case 'GET_OPENID_CONFIGURATION_SUCCESS':
      return Object.assign({}, state, {openIdConfig : action.data});
    case 'ME_STATE_UPDATE' :
      return Object.assign({}, state, {meState : action.data});
    case 'USER_INFO_SUCCESS' :
      return Object.assign({}, state, {user : action.data});
    default:
      return state;
  }
}

 