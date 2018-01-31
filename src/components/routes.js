import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';
import wallet from './wallet/components';
import SettingsModal from './settings/pages/SettingsModal';

export default (
	<div>
			<SettingsModal />
			<Switch>
				<Route path="/" exact component={Pages.Home} />
				<Route path="/home" exact component={Pages.Home} />
				<Route path="/wallet"  component={Pages.Wallet} />
				<Route path="/trade" exact component={Pages.Trade} />
		    <Route path="/portfolio" exact component={Pages.Portfolio}/>
			</Switch>
	</div>
	
)
