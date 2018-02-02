
export default {
  namespace: 'account',
  state: {
    // TODO
    isUnlocked:false,
  },
  reducers: {
    setAccount(state, { payload }) {
      return {
        ...state,
        inUnlocked:true,
        // TODO
      };
    },
    deleteAccount(state, { payload }) {
      return {
        ...state,
        inUnlocked:false,
        // TODO
      };
    },
  },
};
