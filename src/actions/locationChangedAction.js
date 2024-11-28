export const locationChange = ({ hash, history }) => ({
    type: 'ROUTER/LOCATION_CHANGE',
    payload: {
      hash,
      history
    },
  });