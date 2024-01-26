export const locationChange = ({ hash, history }: { hash: any, history: any }) => ({
    type: 'ROUTER/LOCATION_CHANGE',
    payload: {
      hash,
      history
    },
  });