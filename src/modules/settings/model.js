import {configs} from '../../common/config/data'
const selectedContract = configs.contracts[configs.contracts.length-1]
//TODO read(may update) selected contract from localStorage
const relays = configs.relays
//TODO mock custom relay
relays.push({
   "value": "https://relay.my.io",
   "label": "My Relay",
   "custom": true
})
const selectedRelay = relays[0]

export default {
  namespace: 'settings',
  state: {
    preference: {
      language: "en",
      currency: "USD",
      timezone: "UTC+00:00"
    },
    trading: {
      contract: {
        version: selectedContract.version,
        address: selectedContract.address
      },
      lrcFee: 0.001,
      marginSplit: 50,
      gasPrice: 30
    },
    relay: {
      selected: selectedRelay.value,
      nodes: relays
    }
  },
  reducers: {
    preferenceChange(state, { payload }) {
      return {
        ...state,
        preference:payload
      };
    },
    tradingChange(state, { payload }) {
      return {
        ...state,
        trading:payload
      };
    },
    relayChange(state,{payload}){
      return {
        ...state,
        relay:payload
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
