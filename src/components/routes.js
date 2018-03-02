import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import wallet from './wallet/components';
import airdropRoutes from './airdrop/routes';
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
				<Route path="/trade/"  exact component={Pages.Trade} />
				<Route path="/trade/:pair"  exact component={Pages.Trade} />
        <Route path="/portfolio" exact component={Pages.Portfolio}/>
		    <Route path="/airdrop/" exact component={Pages.Portfolio}/>
			</Switch>
      {airdropRoutes}
			<Pages.Unload />
			<TokenModals />
			<WalletModals />
			<SettingsModals />
			<OrderModals />
	</div>

)



