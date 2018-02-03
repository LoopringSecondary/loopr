import dva from 'dva';
// import './index.css';
import './assets/css/index.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
import containers from './common/containers'
import redux from './common/redux'
import uiFormatter from './common/utils/uiFormatter'
import routeActions from './common/utils/routeActions'
import Loopring from 'Loopring'
window.CONTAINERS = containers
window.REDUX = redux
window.Loopring = Loopring
window.uiFormatter = uiFormatter
window.routeActions = routeActions

moment.locale('zh-cn');

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

let models  = [
	require('./modules/global/model').default,
  require('./modules/modals/model').default,
  require('./modules/locales/model').default,
  require('./modules/rings/models/list').default,
  require('./modules/trades/models/list').default,
  require('./modules/orders/models/list').default,
  require('./modules/tokens/models/model').default,
  require('./modules/settings/model').default,
]
models.map(model=>{
  app.model(model)
});

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

