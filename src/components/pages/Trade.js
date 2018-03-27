import React from 'react';
import { Icon,Popover,Tabs,Card,Steps,Button } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import ModalContainer from '../../modules/modals/container'
import intl from 'react-intl-universal'

const ToLogin = ({modal})=>{
  return (
    <div>
      <div className="text-center pt25 pb25">
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/unlock'})} style={{width:'255px'}} type="primary" size="large">{intl.get('buttons.unlock_wallet')}</Button>
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/generate'})} style={{width:'255px'}} type="default" size="large">{intl.get('buttons.generate_wallet')}</Button>
      </div>
    </div>
  )
}
export default function Home(props){
  const { children, match } = props
  let pair = match.params.pair || window.STORAGE.markets.getCurrent() || 'LRC-WETH'
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
        <Card style={{border:'1px solid #dadada',borderRadius:'4px'}}>
          <div className="row justify-content-around">
            <div className="col-sm-6 zb-b-r pl25 pr25 mt25 mb25">
              <Order.TradeForm side="buy" pair={pair} />
            </div>
            <div className="col-sm-6 pl25 pr25 mt25 mb25">
              <Order.TradeForm side="sell" pair={pair} />
            </div>
          </div>
        </Card>
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
