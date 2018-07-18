import '@babel/polyfill'
import dva from 'dva';
// import './index.css';
import './assets/css/index.less'
import containers from './common/containers'
import redux from './common/redux'
import uiFormatter from './common/utils/uiFormatter'
import routeActions from './common/utils/routeActions'
import CONFIG from './common/config'
import STORAGE from './modules/storage'
import {setLocale} from "./common/utils/localeSetting";
import {configs} from './common/config/data'
import UserAgent from './common/utils/useragent'
import {getTokens, getMarkets} from "Loopring/relay/utils";
import Notification from 'Loopr/Notification'
import intl from 'react-intl-universal'

window.CONTAINERS = containers
window.REDUX = redux
window.uiFormatter = uiFormatter
window.routeActions = routeActions
window.CONFIG = CONFIG
const latestVersion = Number(configs.localStorageVersion)
const oldVersion = Number(STORAGE.getLocalStorageVersion())
if(latestVersion > oldVersion) {
  STORAGE.clearLocalStorage()
  STORAGE.setLocalStorageVersion(latestVersion)
}
window.STORAGE = STORAGE
window.WALLET_UNLOCK_TYPE = ''
window.WALLET = null
window.USER_AGENT = new UserAgent();

setLocale(window.STORAGE.settings.get().preference.language);

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

let models  = [
  require('./modules/modals/model').default,
  require('./modules/locales/model').default,
  require('./modules/rings/models/list').default,
  require('./modules/trades/models/list').default,
  require('./modules/orders/models/list').default,
  require('./modules/orders/models/PlaceOrderModel').default,
  require('./modules/tokens/models/ListModel').default,
  require('./modules/tokens/models/EthTxModel').default,
  require('./modules/transactions/models/list').default,
  require('./modules/settings/model').default,
  require('./modules/account/model').default,
  require('./modules/tickers/ListModel').default,
]
models.map(model=>{
  app.model(model)
});

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

getTokens().then(res=>{
  if(res.result) {
    const tokens = new Array()
    tokens.push({
      "symbol": "ETH",
      "digits": 18,
      "address": "",
      "precision": 6,
    })
    res.result.forEach(item=>{
      if(!item.deny) {
        const digit = Math.log10(item.decimals)
        tokens.push({
          "symbol": item.symbol,
          "digits": digit,
          "address": item.protocol,
          "precision": Math.min(digit, 6),
        })
      }
    })
    STORAGE.settings.setTokensConfig(tokens)
    app._store.dispatch({type:'tokens/itemsChange', payload:{items:tokens}})
  }
}).catch(error=> {
  console.log(error)
  Notification.open({
    message:intl.get('notifications.title.init_failed'),
    description:intl.get('notifications.message.failed_fetch_data_from_server'),
    type:'error'
  })
})

getMarkets().then(res=>{
  if(res.result) {
    const markets = res.result.map(item=>{
      const pair = item.split('-')
      return {
        "tokenx": pair[0],
        "tokeny": pair[1],
        "pricePrecision":8
      }
    })
    STORAGE.settings.setMarketsConfig(markets)
  }
}).catch(error=> {
  console.log(error)
  Notification.open({
    message:intl.get('notifications.title.init_failed'),
    description:intl.get('notifications.message.failed_fetch_data_from_server'),
    type:'error'
  })
})

// STORE is available when current route has rendered
// Becarefull to use STORE in render funtion
window.STORE = app._store
