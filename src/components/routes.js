import React from 'react';
import { Route, Switch,Redirect} from 'dva/router';
import Pages from './pages';
import Wallet from './wallet/components';
import RingsRoutes from './rings/routes';
import SettingsModals from './settings/pages/Modals';
import TokenModals from './tokens/components/Modals';
import WalletModals from './wallet/components/Modals';
import OrdersModals from './orders/components/Modals';
import TradesModals from './trades/components/Modals';
import TxsModals from './transactions/components/Modals';
import forceUpdate from 'react-deep-force-update'

const UnLogged = ()=>{
  const isLogged = !!window.WALLET && !!window.WALLET.getAddress()
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
  const isLogged = !!window.WALLET && !!window.WALLET.getAddress()
  if(isLogged){
    return (
      <Switch>
        {
          false &&
          <Route path={`/wallet/portfolio`} exact component={Pages.Portfolio}/>
        }
        <Route path={`/wallet`} component={Pages.Wallet} />
      </Switch>
    )
  }else{
    return <Redirect to="/auth/wallet" />
  }
}

export default class PageRoutes extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const _this = this
    window.forceUpdate = ()=>{
      // forceUpdate(_this)
      _this.forceUpdate()
    }
  }
  render() {
    return (
      <div>
          <Switch>
            <Route path="/" exact component={Pages.Home} />
            <Route path="/home" exact component={Pages.Home} />
            <Route path="/home/dark" exact component={Pages.HomeDark} />
            <Route path="/trade/:pair" component={Pages.Trade} />
            <Route path="/trade"  exact component={Pages.Trade} />
            <Route path="/auth" render={UnLogged} />
            <Route path="/wallet" render={Logged} />
            <Route path="/test" render={Pages.Test} />
            {RingsRoutes}
          </Switch>
          <Pages.Unload />
          <TokenModals />
          <WalletModals />
          <SettingsModals />
          <OrdersModals />
          <TradesModals />
          <TxsModals />
      </div>
    );
  }
}




