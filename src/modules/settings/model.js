import {configs} from '../../common/config/data'

const preference = window.STORAGE.settings.get().preference
const trading = window.STORAGE.settings.get().trading
const relay = window.STORAGE.settings.get().relay
const selectedContract = trading ? trading.contract : configs.contracts[configs.contracts.length-1]
const relays = relay ? relay.nodes : configs.relays
let sortedRelays = relays.map((item, i) => {
  item.id = i;
  return item
})
const selectedRelay = relay ? relay.selected : sortedRelays[0].value

const setRelayIds = (relays) => {
  relays.forEach((item, i) => {
    item.id = i;
  })
}

export default {
  namespace: 'settings',
  state: {
    preference: {
      language: preference ? preference.language : "en-US",
      currency: preference ? preference.currency : "USD",
      timezone: preference ? preference.timezone : "UTC+00:00"
    },
    trading: {
      contract: {
        version: selectedContract.version,
        address: selectedContract.address
      },
      timeToLive: trading ? trading.timeToLive : configs.defaultExpireTime,
      timeToLiveUnit: trading ? trading.timeToLiveUnit : configs.defaultExpireTimeUnit,
      lrcFee: trading ? trading.lrcFee : configs.defaultLrcFeePermillage,
      marginSplit: trading ? trading.marginSplit : configs.defaultMarginSplitPercentage,
      gasPrice: trading ? trading.gasPrice : configs.defaultGasPrice
    },
    relay: {
      selected: selectedRelay,
      nodes: sortedRelays
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
