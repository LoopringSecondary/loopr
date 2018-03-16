import dva from 'dva';
// import './index.css';
import './assets/css/index.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
import containers from './common/containers'
import redux from './common/redux'
import uiFormatter from './common/utils/uiFormatter'
import routeActions from './common/utils/routeActions'
import CONFIG from './common/config'
import STORAGE from './modules/storage'
window.CONTAINERS = containers
window.REDUX = redux
window.uiFormatter = uiFormatter
window.routeActions = routeActions
window.CONFIG = CONFIG
window.STORAGE = STORAGE
window.WALLET = {
  address:'0xf2dad0425f304fa988ca19cf4b77e41d51130ed7',
  getAddress:()=>'0xf2dad0425f304fa988ca19cf4b77e41d51130ed7',
}

moment.locale('zh-cn');

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

