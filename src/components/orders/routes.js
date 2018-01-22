import React from 'react';
import { Route, Switch } from 'dva/router';
import Containers from './containers';

export default (
		<Switch>
			<Route path="/orders" exact component={Containers.List} />
			<Route path="/orders/list" exact component={Containers.List} />
			<Route path="/orders/detail/:id" exact component={Containers.Detail} />
		</Switch>
)
