import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Layout from './layout/Layout';
import pageRoutes from './components/routes';
import Locales from './modules/locales/container'
function RouterConfig({ history }) {
  return (
    <Locales>
        <Router history={history}>
    		<Layout>
    		    {pageRoutes}
    		</Layout>
        </Router>
    </Locales>
    
  );
}
export default RouterConfig;
