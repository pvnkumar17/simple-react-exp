import axios from 'axios';

export const CallApi = {
    directCall
};

function handleGenericError(jqXHR, callback) {
}

function handleUnauthorised(jqXHR){
}

function buildErrorHandlerConfig(axiosConfig) {
    var config = {};

    config.error = axiosConfig.errorCallback || handleGenericError;



    return config;
};

function setUserAuthToken() {
    let token = localStorage.getItem('apiToken');
    if(!!token){
       axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
}

function getDefaultRequestConfig(appXhrConfig) {
    let axiosConfig = {

        // `method` is the request method to be used when making the request
        method: 'GET', // default

        // `headers` are custom headers to be sent
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

    };
    return {...axiosConfig, ...appXhrConfig};
};

  async function directCall(webservice, config) {

    let axiosConfig = getDefaultRequestConfig(config || {});
     axiosConfig = Object.assign(axiosConfig, buildErrorHandlerConfig(axiosConfig));
     if(config.responseType) {
        axiosConfig.responseType = config.responseType;
        axiosConfig.headers.Accept = '*/*';
     };
     setUserAuthToken();
     const XhrRes = await axios(webservice, axiosConfig)
         .then(function(response) {
            response.config.successCallback && response.config.successCallback(response.data);
            return response.data;
         })
         .catch(function(error) {
            if (error.config && error.config.error){
                error.config.error(error.response);
            }
             throw error.response;
         });
        return XhrRes; 
}
