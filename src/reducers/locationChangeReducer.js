const getInitialState = {
    hash: '',
    history: {}
};

export default (state = getInitialState, action) => {
    switch (action.type) {
        case 'ROUTER/LOCATION_CHANGE':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};