import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Layout from './layout/Layout';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import pageRoutes from './components/routes';

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={enUS}>
        <Router history={history}>
            <Layout>
                {pageRoutes}
            </Layout>
        </Router>
    </LocaleProvider>
    
  );
}
export default RouterConfig;

/*<Switch>
    <Route path="/" exact component={Containers.List} />
    <Route path="/ring/list" exact component={Containers.List} />
    <Route path="/ring/detail" exact component={Containers.Detail} />
</Switch>*/
