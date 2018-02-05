import {configs} from '../../common/config/data'
const selectedContract = configs.contracts[configs.contracts.length-1]
//TODO read(may update) selected contract from localStorage
const relays = configs.relays
//TODO mock custom relay
const localRelay = [
  {
    "value": "https://relay.my.1.io",
    "name": "My Relay1",
    "custom": true
  },
  {
    "value": "https://relay.my.2.io",
    "name": "My Relay2",
    "custom": true
  }
]
let concatRelays = new Array();
[...relays, ...localRelay].forEach((item, i) => {
  item.id = i;
  concatRelays.push(item)
})
const selectedRelay = concatRelays[0]

const setRelayIds = (relays) => {
  relays.forEach((item, i) => {
    item.id = i;
  })
}

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
      selected: selectedRelay.id,
      nodes: concatRelays
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
      concatRelays.push({value: payload.url, name : payload.name, custom: true})
      return {
        ...state,
        relay:{
          ...state.relay,
          nodes: [ ...concatRelays ]
        }
      }
    },
    editRelay(state,{payload}){
      const index = concatRelays.findIndex(item => item.id === payload.id)
      concatRelays[index] = {
        ...concatRelays[index],
        value : payload.url,
        name : payload.name,
      }
      return {
        ...state,
        relay:{
          ...state.relay,
          nodes: [ ...concatRelays ]
        }
      }
    },
    deleteRelay(state,{payload}){
      const relays = concatRelays.filter(item => item.id != payload.id)
      setRelayIds(relays)
      return {
        ...state,
        relay:{
          ...state.relay,
          nodes: [ ...relays ]
        }
      }
    },
  },
};
