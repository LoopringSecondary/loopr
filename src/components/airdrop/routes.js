import React from 'react';
import { Route, Switch } from 'dva/router';
import Components from './components';
import Layout from '../../layout/Layout'

export default (
    <Layout>
      <Switch>
        <Route path="/airdrop/bindAddress" exact component={Components.BindAddress} />
      </Switch>
    </Layout>

)
