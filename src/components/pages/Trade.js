import React from 'react';
import { Icon,Popover,Tabs,Card,Steps,Button,Row,Col } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import TradeList from '../trades/components/ListSimple'
import Order from '../orders/containers'
import ListOrderBook from '../orders/components/List/ListOrderBook'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import ModalContainer from '../../modules/modals/container'
import intl from 'react-intl-universal'

const ToLogin = ({modal})=>{
  return (
    <div>
      <div className="text-center pt25 pb25">
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/unlock',targetModalData: {}})} style={{width:'255px'}} type="primary" size="large">{intl.get('buttons.unlock_wallet')}</Button>
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/generate'})} style={{width:'255px'}} type="default" size="large">{intl.get('buttons.generate_wallet')}</Button>
      </div>
    </div>
  )
}
export default function Home(props){
  const { children, match } = props
  let pair = match.params.pair || window.STORAGE.markets.getCurrent() || 'LRC-WETH'
  const tokenL = pair.split('-')[0].toUpperCase()
  if(pair.indexOf('-') < 0){ }
  // TODO if market is not support or goto some route

  const tabChange = (key) => {
    if(window.WALLET && window.WALLET.getAddress()) {
      switch(key) {
        case 'orders': refreshOrders(); break;
        case 'trades': refreshTrades(); break;
        default: break;
      }
    }
  };
  const refreshOrders = ()=>{
    window.STORE.dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade'
      }
    })
  };
  const refreshTrades = ()=>{
    window.STORE.dispatch({
      type:'trades/filtersChange',
      payload:{
        id:'orders/trade'
      }
    })
  };

  return (
    <Layout {...props}>
      <Sockets.TickersByPair pair={pair}>
        <Sockets.Prices>
          <Market.TickerItem pair={pair} />
        </Sockets.Prices>
      </Sockets.TickersByPair>
      <div className="container">
          <div className="row justify-content-around align-items-st gutter-0 zb-b">
            <div className="col-md-6 col-sm-6 bg-white">
              <div className="row gutter-0">
                <div className="col-md-6 zb-b-r">
                  <div className="fs2 color-black-1 pt10 pb10 pl5 zb-b-b">
                    Order Book
                  </div>
                  <Sockets.Depth market={pair}>
                    <ListOrderBook />
                  </Sockets.Depth>
                </div>
                <div className="col-md-6 zb-b-r">
                  <div className="fs2 color-black-1 pt10 pb10 pl5 zb-b-b">
                    Trades History
                  </div>
                  <Sockets.Trades market={pair}>
                    <TradeList />
                  </Sockets.Trades>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 bg-white">
              <Tabs forceRender={true} defaultActiveKey="sell" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
                <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Sell {tokenL}</div>} key="sell">
                  <div className="p15">
                    <Order.TradeForm side="sell" pair={pair} />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Buy {tokenL}</div>} key="Buy">
                  <div className="p15">
                    <Order.TradeForm side="buy" pair={pair} />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        <div className="bg-white mt15" style={{border:'1px solid #dadada',borderRadius:'4px'}}>
          <Tabs defaultActiveKey="orders" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('tabs.my_open_orders')}</div>} key="orders">
              <div className="">
                {
                  window.WALLET && window.WALLET.getAddress() &&
                  <Order.List id="orders/trade" />
                }
                {
                  !(window.WALLET && window.WALLET.getAddress()) &&
                  <ModalContainer apisOnly={true}>
                    <ToLogin />
                  </ModalContainer>
                }
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('tabs.my_recent_trades')}</div>} key="trades">
              <div className="">
                {
                  window.WALLET && window.WALLET.getAddress() &&
                  <Trade.List />
                }
                {
                  !(window.WALLET && window.WALLET.getAddress()) &&
                  <ModalContainer apisOnly={true}>
                    <ToLogin />
                  </ModalContainer>
                }
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="mb50"></div>
      </div>
    </Layout>
  )
}
