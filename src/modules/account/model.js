
export default {
  namespace: 'account',
  state: {
    address:null,
    privateKey:null,
    mnemonic:null,
    publicKey:null,
    password:null,
    isUnlocked:false,
  },
  reducers: {
    setAccount(state, { payload }) {
      return {
        ...state,
        ...payload,
        isUnlocked:true,
      };
    },
    deleteAccount(state, { payload }) {
      return {
        ...state,
        isUnlocked:false,
        // TODO
      };
    },
  },
};
