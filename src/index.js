import dva from 'dva';
// import './index.css';
import './assets/css/index.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
import containers from './common/containers'
import redux from './common/redux'
import Loopring from './common/Loopring'
window.CONTAINERS = containers
window.REDUX = redux
window.Loopring = Loopring

moment.locale('zh-cn');

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

let models  = [
  require('./modules/locales/model').default,
  require('./modules/rings/models/list').default,
  require('./modules/trades/models/list').default,
  require('./modules/orders/models/list').default
]
models.map(model=>{
  app.model(model)
});

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
