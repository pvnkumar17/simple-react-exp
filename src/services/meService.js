import { CallApi } from './apiCalls';

export const getUserDetails = () => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall('http://localhost:9001/v1/nodes', {})
    } else {
        return null
    }
};
export const getDeletedNodes = () => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall('http://localhost:9001/v1/nodes/deleted-nodes', {})
    } else {
        return null
    }
};

export const setUserEditorData = (editorId, data) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/editor/${editorId}`, {
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

export const renameAction = (payload, nodeId) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/nodes/${nodeId}/rename`, {
            method: 'PUT',
            data: payload,
        })
    } else {
        return null
    }
};

export const moveAction = (payload) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/nodes/${payload.nodeId}/move`, {
            method: 'PUT',
            data: payload,
        })
    } else {
        return null
    }
};

export const deleteAction = (nodeId) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/nodes/${nodeId}`, {
            method: 'DELETE',
        })
    } else {
        return null
    }
};
export const getEditorData = (editorId) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        return CallApi.directCall(`http://localhost:9001/v1/editor/${editorId}`, {
            method: 'GET',
        })
    } else {
        return null
    }
};