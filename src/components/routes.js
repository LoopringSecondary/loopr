import React from 'react';
import { Route, Switch } from 'dva/router';
import Wallet from './wallet/index';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';

export default (
		<Switch>
			<Route path="/" exact component={Wallet} />
			<Route path="/wallet" exact component={Wallet} />
			{ordersRoutes}
			{ringsRoutes}
		</Switch>
)
