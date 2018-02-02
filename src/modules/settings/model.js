
export default {
  namespace: 'settings',
  state: {
    preference: {
      language: "en",
      currency: "USD",
      timezone: "UTC +8:00"
    },
    trading: {
      contract: {
        version: "v2.0",
        address: "0x1111"
      },
      lrcFee: 0.001,
      marginSplit: 50,
      gasPrice: 30
    },
    relay: [
      {
        name: "Default",
        url: "https://relay1.loopring.io"
      },
      {
        name: "Backup",
        url: "https://relay2.loopring.io"
      }
    ]
  },
  reducers: {
    preferenceChange(state, { payload }) {
      return {
        ...state,
        preference:{
          language: payload.languange,
          currency: payload.currency,
          timezone: payload.timezone
        }
      };
    },
    tradingChange(state, { payload }) {
      return {
        ...state,
        // TODO
      };
    },
    relayChange(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    languageChange(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    currenryChange(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    timezoneChange(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    addRelay(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    editRelay(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
    deleteRelay(state,{payload}){
      // TODO
      return {
        ...state
        // TODO
      }
    },
  },
};
