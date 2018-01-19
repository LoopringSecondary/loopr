import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';

export default (
		<Switch>
			<Route path="/orders" exact component={Pages.List} />
			<Route path="/orders/list" exact component={Pages.List} />
			<Route path="/orders/detail/:id" exact component={Pages.Detail} />
		</Switch>
)
