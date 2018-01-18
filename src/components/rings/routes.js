import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
export default (
		<Switch>
			<Route path="/rings" exact component={Pages.List} />
			<Route path="/rings/list" exact component={Pages.List} />
			<Route path="/rings/detail/:id" exact component={Pages.Detail} />
		</Switch>
)
