import React from 'react';
import { Route, Switch,Redirect} from 'dva/router';
import Pages from './pages';
import wallet from './wallet/components';
import airdropRoutes from './airdrop/routes';
import SettingsModals from './settings/pages/Modals';
import TokenModals from './tokens/components/Modals';
import WalletModals from './wallet/components/Modals';
import OrderModals from './orders/components/Modals';

const UnLogged = ()=>{
  const isLogged = false
  if(isLogged){
    return <Redirect to="/wallet/portfolio" />
  }else{
    return (
      <Switch>
        <Route path="/auth/wallet" component={Pages.Auth} />
        <Route path="/auth" component={Pages.Auth} />
      </Switch>
    )
  }
}
const Logged = ()=>{
  const isLogged = false
  if(isLogged){
    return (
      <Switch>
        <Route path={`/wallet`} component={Pages.Wallet} />
        <Route path={`/wallet/portfolio`} exact component={Pages.Portfolio}/>
        {airdropRoutes}
      </Switch>
    )
  }else{
    return <Redirect to="/auth/wallet" />
  }
}



export default (
  <div>
      <Switch>
        <Route path="/" exact component={Pages.Home} />
        <Route path="/home" exact component={Pages.Home} />
        <Route path="/trade/:pair"  exact component={Pages.Trade} />
        <Route path="/trade"  exact component={Pages.Trade} />
        <Route path="/auth" render={UnLogged} />
        <Route path="/wallet" render={Logged} />
      </Switch>
      <Pages.Unload />
      <TokenModals />
      <WalletModals />
      <SettingsModals />
      <OrderModals />
  </div>

)





