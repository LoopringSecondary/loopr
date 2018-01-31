import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';
import wallet from './wallet/components';
import Settings from './settings/pages/Settings';
import TradeConfirm from './orders/components/TradeConfirm';
import TradeSteps from './orders/components/TradeSteps';
import ModalContainer from '../modules/modals/container'

export default (
	<div>
			<Switch>
				<Route path="/" exact component={Pages.Home} />
				<Route path="/home" exact component={Pages.Home} />
				<Route path="/wallet"  component={Pages.Wallet} />
				<Route path="/trade" exact component={Pages.Trade} />
		    <Route path="/portfolio" exact component={Pages.Portfolio}/>
			</Switch>
			<ModalContainer id="settings">
			  <Settings />
			</ModalContainer>
			<ModalContainer id="trade/confirm">
			  <TradeConfirm />
			</ModalContainer>
			<ModalContainer id="trade/steps">
			  <TradeSteps />
			</ModalContainer>
	</div>
	
)


 
