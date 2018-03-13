import React from 'react';
import { Route, Switch } from 'dva/router';
import Pages from './pages';
import wallet from './wallet/components';
import airdropRoutes from './airdrop/routes';
import SettingsModals from './settings/pages/Modals';
import TokenModals from './tokens/components/Modals';
import WalletModals from './wallet/components/Modals';
import OrderModals from './orders/components/Modals';

const UnLogged = ()=>{
  return (
    <Switch>
      <Route path="/login" exact component={Pages.Home} />
      <Route path="/trade/"  exact component={Pages.Trade} />
      <Route path="/trade/:pair"  exact component={Pages.Trade} />
    </Switch>
  )
}
const Logged = ()=>{
  return (
    <Switch>
      <Route path={`/home`} exact component={Pages.Home} />
      <Route path={`/wallet`} exact component={Pages.Wallet} />
      <Route path={`/portfolio`} exact component={Pages.Portfolio}/>
      {airdropRoutes}
    </Switch>
  )
}

export default (
  <div>
      <Switch>
        <Route path="/" render={Logged} />
        <Route path="/" render={UnLogged} />
      </Switch>
      <Pages.Unload />
      <TokenModals />
      <WalletModals />
      <SettingsModals />
      <OrderModals />
  </div>

)





