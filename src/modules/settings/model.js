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
      language: "en_US",
      currency: "USD",
      timezone: "UTC+00:00"
    },
    trading: {
      contract: {
        version: selectedContract.version,
        address: selectedContract.address
      },
      timeToLive: configs.defaultExpireTime,
      timeToLiveUnit: configs.defaultExpireTimeUnit,
      lrcFee: configs.defaultLrcFeePermillage,
      marginSplit: configs.defaultMarginSplitPercentage,
      gasPrice: configs.defaultGasPrice
    },
    relay: {
      selected: selectedRelay.value,
      nodes: concatRelays
    }
  },
  reducers: {
    preferenceChange(state, { payload }) {
      let newState =  {
        ...state,
        preference: {
          ...state.preference,
          ...payload
        }
      };
      window.STORAGE.settings.set(newState)
      return newState
    },
    tradingChange(state, { payload }) {
      let newState =  {
        ...state,
        trading: {
          ...state.trading,
          ...payload
        }
      };
      window.STORAGE.settings.set(newState)
      return newState
    },
    relayChange(state,{payload}){
      let newState =  {
        ...state,
        relay: {
          ...state.relay,
          selected: payload.selected
        }
      }
      window.STORAGE.settings.set(newState)
      return newState
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

      const newNodes = [...state.relay.nodes];
      newNodes.push({value: payload.url, name : payload.name, custom: true})
      let newState =  {
        ...state,
        relay:{
          ...state.relay,
          nodes: [ ...newNodes ]
        }
      }
      window.STORAGE.settings.set(newState)
      return newState
    },
    editRelay(state,{payload}){
      const newNodes = [...state.relay.nodes];
      const index = newNodes.findIndex(item => item.id === payload.id)
      newNodes[index] = {
        ...newNodes[index],
        value : payload.url,
        name : payload.name,
      }
      let newState =  {
        ...state,
        relay:{
          ...state.relay,
          nodes: [ ...newNodes ]
        }
      }
      window.STORAGE.settings.set(newState)
      return newState
    },
    deleteRelay(state,{payload}){
      const toDelete = state.relay.nodes.find(item => item.id === payload.id)
      const newNodes = state.relay.nodes.filter(item => item.id !== payload.id)
      setRelayIds(newNodes)
      const selected = state.relay.selected === toDelete.value ? newNodes[0].value : state.relay.selected
      let newState =  {
        ...state,
        relay:{
          selected: selected,
          nodes: [ ...newNodes ]
        }
      }
      window.STORAGE.settings.set(newState)
      return newState
    },
  },
};
