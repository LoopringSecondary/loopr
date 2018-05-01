import React from 'react';
import {Alert, Tabs,Icon} from 'antd'
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
    const gotoTrade = (market)=>{
      window.routeActions.gotoPath(`/trade/${market}`)
    }


    return (
      <Layout {...this.props}>
        <div className="container">
          {
            false &&
            <Alert className="mt15" message={
              <div className="row gutter-0 align-items-center">
                <div className="col-auto fs12">
                  <Icon type="notification" className="mr5 fs20" />
                </div>
                <div className="col pl10">
                  <div className="color-black-1 fs14 lh20">Test Loopring’s web wallet & DEX</div>
                  <div className="color-black-2 fs12" >
                    Participate in the private sale of ARP and VITE tokens by submitting your first Loopring DEX orders.
                    <span onClick={gotoTrade.bind(this,'VITE-WETH')} className="fs12 color-primary-1 ml10 mr10 cursor-pointer">
                      {intl.get('trade.buy')} VITE<Icon type="right"/>
                    </span>
                    <span onClick={gotoTrade.bind(this,'ARP-WETH')} className="fs12 color-primary-1 cursor-pointer">
                      {intl.get('trade.buy')} ARP<Icon type="right"/>
                    </span>
                  </div>
                </div>
                <div className="col-auto">

                </div>
              </div>
            } type="info" closable showIcon={false}/>
          }
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
                activeKey={location.pathname.replace(`${match.path}/`, '')}
                animated={false}
                tabBarExtraContent={
                    null &&
                    <Alert
                      message={intl.get('userguide.btn_title')}
                      type="info"
                      className="mt15"
                      showIcon
                    />
                }
          >
            {
              false &&
              <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 "> {intl.get("tabs.my_portfolio")}</div>}
                          key="portfolio"/>
             }
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 "> {intl.get("tabs.my_assets")}</div>}
                          key="assets"/>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("tabs.my_orders")}</div>}
                          key="orders"/>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("tabs.my_trades")}</div>}
                          key="trades"/>
          </Tabs>

          <Switch>
            <Route path={`${match.url}/portfolio`} exact render={() =>
              <div className="row no-gutters bg-white wallet-assets-container"
                   style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <Portfolio/>
              </div>
            }
            />
            <Route path={`${match.url}/assets`} exact render={() =>
              <div className="row no-gutters bg-white wallet-assets-container"
                   style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <div className="col zb-b-r" style={{flex:'0 0 30%'}}>
                  <Token.ListSidebar/>
                </div>
                <div className="col pb15" style={{flex:'0 0 70%'}}>
                  <Transaction.ListStand/>
                </div>
              </div>
            }
            />
            <Route path={`${match.url}/assets/:token`} exact render={() =>
              <div className="row no-gutters bg-white wallet-assets-container"
                   style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <div className="col-4 zb-b-r">
                  <Token.ListSidebar selectedToken={location.pathname.replace(`/wallet/assets/`, '')}/>
                </div>
                <div className="col-8 pb15">
                  <Transaction.ListStand/>
                </div>
              </div>
            }
            />
            <Route path={`${match.url}/assets2`} render={() =>
              <div className="row no-gutters bg-white wallet-assets-container"
                   style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
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
              <div className="pb0 bg-white wallet-orders-container" style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
                <Order.List id="orders/wallet"/>
              </div>
            }
            />
            <Route path={`${match.url}/trades`} render={() =>
              <div className="pb0 bg-white wallet-trades-container" style={{borderRadius: '0px', border: '1px solid rgba(0,0,0,0.08)'}}>
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
