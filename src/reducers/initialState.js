export default {
  userDomInfo: {
  	theme: 'theme-default'
  },
  ajaxCall: {
  	ajaxCallInProgress:false
  },
  meData : {
		openIdConfig: [],
		refreshTokenTimer: null,
		refreshInterval: 50, // in seconds
		decodedAccessToken: null,
		accessToken: null,
		refreshToken: null,
		userName: null,
		user: null,
		loginError: {},
		isInit: false,
		state: {},
		roles: [],
		refreshTokenFlag: false,
		meState : {
			AUTHENTICATING: false,
			OPENID_CONFIG: false,
			LOGGED_IN: false,
			USER_DETAILS: false,
			HAS_PERMISSIONS: false,
			FETCHING_PERMISSIONS: false,
			FETCHING_RESOURCE_RIGHTS: false,
			LOGIN_ERROR: false,
			APPLY_ONBOARDING: false
		}
	}
}





