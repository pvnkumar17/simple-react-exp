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
}

  async function directCall(webservice, config) {

    let axiosConfig = getDefaultRequestConfig(config || {});
     axiosConfig = Object.assign(axiosConfig, buildErrorHandlerConfig(axiosConfig));
     if(config.responseType) {
        axiosConfig.responseType = config.responseType;
        axiosConfig.headers.Accept = '*/*';
     }
     const XhrRes = await axios(webservice, axiosConfig)
         .then(function(response) {
                response.config.successCallback(response.data);
            return response.data;
         })
         .catch(function(error) {
            if (error){
                handleUnauthorised(error.response);
            }
             throw error.response;
         });
        return XhrRes; 
}
