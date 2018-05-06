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
import PagesModals from './pages/Modals';
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
        <Route path={`/wallet`} component={Pages.Wallet} />
        <Route path="/trade/:pair" component={Pages.Trade} />
        <Route path="/trade"  exact component={Pages.Trade} />
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
    // window.forceUpdate = ()=>{
    //   // forceUpdate(_this)
    //   _this.forceUpdate()
    // }
  }
  render() {
    return (
      <div>
          <Switch>
            <Route path="/" exact component={Pages.HomeDark} />
            <Route path="/home" exact component={Pages.HomeDark} />
            <Route path="/auth" render={UnLogged} />
            <Route path="/wallet" render={Logged} />
            <Route path="/trade" render={Logged} />
            {RingsRoutes}
          </Switch>
          <TokenModals />
          <PagesModals />
          <WalletModals />
          <SettingsModals />
          <OrdersModals />
          <TradesModals />
          <TxsModals />
      </div>
    );
  }
}




