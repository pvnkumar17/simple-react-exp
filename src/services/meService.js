import { CallApi } from './apiCalls';

export const getUserDetails = () => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall('http://localhost:9001/v1/nodes', {})
    } else {
        return null
    }
};

export const setUserEditorData = (id, data) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/nodes/${id}`, {
            method: 'PUT',
            data: { data: data }
        })
    } else {
        return null
    }
};

export const menuActonHandle = (payload) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/nodes/`, {
            method: 'POST',
            data: payload,
        })
    } else {
        return null
    }
};
