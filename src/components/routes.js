import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';
import wallet from './wallet/components';
import SettingsModals from './settings/pages/Modals';
import TokenModals from './tokens/components/Modals';
import WalletModals from './wallet/components/Modals';
import OrderModals from './orders/components/Modals';

export default (
	<div>
			<Switch>
				<Route path="/" exact component={Pages.Home} />
				<Route path="/home" exact component={Pages.Home} />
				<Route path="/wallet"  component={Pages.Wallet} />
				<Route path="/trade/:pair" exact component={Pages.Trade} />
		    <Route path="/portfolio" exact component={Pages.Portfolio}/>
			</Switch>
			<Pages.Unload />
			<TokenModals />
			<WalletModals />
			<SettingsModals />
			<OrderModals />
	</div>
	
)


 
