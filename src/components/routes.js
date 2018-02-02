import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import ordersRoutes from './orders/routes';
import ringsRoutes from './rings/routes';
import wallet from './wallet/components';
import SettingsModals from './settings/pages/Modals';
import TradeConfirm from './orders/components/TradeConfirm';
import TokenModals from './tokens/components/Modals';
import TradeSteps from './orders/components/TradeSteps';
import Wallet from './wallet/components'
import ModalContainer from '../modules/modals/container'
import AccountContainer from '../modules/account/container'

export default (
	<div>
			<Switch>
				<Route path="/" exact component={Pages.Home} />
				<Route path="/home" exact component={Pages.Home} />
				<Route path="/wallet"  component={Pages.Wallet} />
				<Route path="/trade" exact component={Pages.Trade} />
		    <Route path="/portfolio" exact component={Pages.Portfolio}/>
			</Switch>
			<TokenModals />
			<SettingsModals />
			<ModalContainer id="trade/confirm">
			  	<TradeConfirm />
			</ModalContainer>
			<ModalContainer id="trade/steps">
			  	<TradeSteps />
			</ModalContainer>
			<ModalContainer id="wallet/unlock" >
				<AccountContainer>
			  	<Wallet.UnlockWallet />
			  </AccountContainer>
			</ModalContainer>
			<ModalContainer id="wallet/generate" >
				<AccountContainer>
					<Wallet.GenerateWallet />
				</AccountContainer>
			</ModalContainer>
			<ModalContainer id="wallet/backup" >
				<AccountContainer>
			  	<Wallet.BackupWallet />
			  </AccountContainer>
			</ModalContainer>

	</div>
	
)


 
