import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';
import wallet from './wallet/components';
export default (
	<div>
		<div>
			<Switch>
				<Route path="/" exact component={Pages.Home} />
				<Route path="/home" exact component={Pages.Home} />
				<Route path="/wallet"  component={Pages.Wallet} />
				<Route path="/market" exact component={Pages.Market} />
        <Route path="/setting" exact component={Pages.Settings} />
        <Route path="/portfolio" exact component={Pages.Portfolio}/>
        <Route path="/unlock" exact component={wallet.UnlockWallet}/>
        <Route path="/generate" exact component={wallet.GenerateWallet}/>
        <Route path="/backup" exact component={wallet.BackupWallet}/>
			</Switch>
			{ringsRoutes}
			{ordersRoutes}
		</div>
	</div>
)
