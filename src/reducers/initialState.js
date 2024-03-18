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
		deletedNodes: [],
		editorData: {
			"_id": "",
			"title": "iphone1",
			"isRoot": false,
			"type": "file",
			"parentId": "65b4faef1cb9c378e8f16904",
			"children": [],
			"userId": "65b4faed1cb9c378e8f16902",
			"createdBy": {
				"email": "pvnk17@gmail.com",
			},
			"data": {
				"text": "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"iphone1\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"heading\",\"version\":1,\"tag\":\"h1\"}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}"
			},
			"createdAt": "2024-01-27T12:48:40.094Z",
			"updatedAt": "2024-02-05T07:57:58.393Z",
			"__v": 0
		},
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





