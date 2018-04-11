import React from 'react';
import {Alert, Tabs} from 'antd'
import {FormattedMessage} from 'react-intl';
import {Redirect, Route, Switch} from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Portfolio from './Portfolio'
import Layout from '../../layout/Layout'
import intl from 'react-intl-universal';
import {connect} from 'dva';
import {getOldWethBalance} from 'Loopring/relay/utils';
import {toBig} from "Loopring/common/formatter";
import Sockets from '../../modules/socket/containers';

class Home extends React.Component {

  state = {
    oldWeth: 0
  };

  componentDidMount() {
    getOldWethBalance(window.WALLET.getAddress()).then(res => {
      if (!res.error) {
        this.setState({oldWeth: res.result})
      }
    })
  }

  render() {
    const {match, location} = this.props;
    const handleTabChange = (key) => {
      switch (key) {
        case 'portfolio':
          window.routeActions.gotoPath(`${match.url}/portfolio`);
          break;
        case 'assets':
          window.routeActions.gotoPath(`${match.url}/assets`);
          break;

        case 'assets2':
          window.routeActions.gotoPath(`${match.url}/assets2`);
          break;
        case 'orders':
          window.routeActions.gotoPath(`${match.url}/orders`);
          break;
        case 'trades':
          window.routeActions.gotoPath(`${match.url}/trades`);
          break;
        default:
          break;
      }
    };
    const showWithDrawAll = () => {
      this.props.dispatch({
        type: 'modals/modalChange',
        payload: {id: "token/withdrawall", visible: true, item: {symbol: "WETH_OLD", balance: this.state.oldWeth}}
      })
    };

    return (
      <Layout {...this.props}>
        <div className="container">
          {
            toBig(this.state.oldWeth).gt(1e16) &&
            <Sockets.PendingTxs render={({txs}) => {
              return (!txs.isWithdrawOldWeth() && <Alert type="warning" showIcon closable className="mt15"
                       description={
                         <div>
                           {intl.get('wallet.old_weth_detect')} (<a className='color-blue-500 pointer'>Why?</a>)
                           <a className='color-blue-500 ml5' onClick={showWithDrawAll}>{intl.get('wallet.to_convert')}</a>
                         </div>
                       }
                />
              )
            }}>

            </Sockets.PendingTxs>
          }
          <Tabs className="rs no-ink-bar" onChange={handleTabChange}
                activeKey={location.pathname.replace(`${match.path}/`, '')} animated={false}>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 "> {intl.get("tabs.my_portfolio")}</div>}
                          key="portfolio"/>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 "> {intl.get("tabs.my_assets")}</div>}
                          key="assets"/>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("tabs.my_orders")}</div>}
                          key="orders"/>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("tabs.my_trades")}</div>}
                          key="trades"/>
          </Tabs>
          <Switch>
            <Route path={`${match.url}/portfolio`} exact render={() =>
              <div className="row no-gutters bg-white"
                   style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <Portfolio/>
              </div>
            }
            />
            <Route path={`${match.url}/assets`} exact render={() =>
              <div className="row no-gutters bg-white"
                   style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <div className="col-4 zb-b-r">
                  <Token.ListSidebar/>
                </div>
                <div className="col-8 pb15">
                  <Transaction.ListStand2/>
                </div>
              </div>
            }
            />
            <Route path={`${match.url}/assets/:token`} exact render={() =>
              <div className="row no-gutters bg-white"
                   style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <div className="col-4 zb-b-r">
                  <Token.ListSidebar selectedToken={location.pathname.replace(`/wallet/assets/`, '')}/>
                </div>
                <div className="col-8 pb15">
                  <Transaction.ListStand2/>
                </div>
              </div>
            }
            />
            <Route path={`${match.url}/assets2`} render={() =>
              <div className="row no-gutters bg-white"
                   style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <div className="col-4 zb-b-r">
                  <Token.ListSidebar/>
                </div>
                <div className="col-8 pb15">
                  <Transaction.ListStand/>
                </div>
              </div>
            }
            />

            <Route path={`${match.url}/orders`} exact render={() =>
              <div className="pb0 bg-white" style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <Order.List id="orders/wallet"/>
              </div>
            }
            />
            <Route path={`${match.url}/trades`} render={() =>
              <div className="pb0 bg-white" style={{borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <Trade.List/>
              </div>
            }
            />
            <Redirect path={`${match.url}/`} to={`${match.url}/assets`}/>
          </Switch>
        </div>
        <div className="mb50"></div>
      </Layout>

    )
  }
}

export default connect()(Home)
