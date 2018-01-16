import React from 'react';
import { Route, Switch } from 'dva/router';
import Wallet from './wallet/index';

export default (
		<Switch>
			<Route path="/wallet" exact component={Wallet} />
		</Switch>
)
