import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';

export default (
		<Switch>
			<Route path="/trades" exact component={Pages.List} />
			<Route path="/trades/list" exact component={Pages.List} />
			<Route path="/trades/detail/:id" exact component={Pages.Detail} />
		</Switch>
)
