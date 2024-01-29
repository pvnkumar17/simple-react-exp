import { CallApi } from './apiCalls';

export const getUserDetails = () => {
    const token = localStorage.getItem('apiToken');
    if(token){
        return CallApi.directCall('http://localhost:9001/v1/nodes', {
            method: 'GET'
    })} else {
        return null
    }
}

