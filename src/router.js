import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Layout from './layout/Layout';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import pageRoutes from './components/routes';
import Locales from './locales'
function RouterConfig({ history }) {
  return (
    <Locales>
        <LocaleProvider locale={enUS}>
            <Router history={history}>
    			<Layout>
    			    {pageRoutes}
    			</Layout>
            </Router>
        </LocaleProvider>
    </Locales>
    
  );
}
export default RouterConfig;
