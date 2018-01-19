import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';

export default (
		<Switch>
			<Route path="/tokens" exact component={Pages.List} />
			<Route path="/tokens/list" exact component={Pages.List} />
			<Route path="/tokens/detail/:id" exact component={Pages.Detail} />
		</Switch>
)
