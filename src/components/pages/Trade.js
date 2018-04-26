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
        {
          false &&
          <div className="zb-b">
            <div className="row align-items-stretch gutter-0 bg-white">
              <div className="col-auto zb-b-r" style={{flex:'0 0 20%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.order_book')}
                </div>
                <div>
                  <Sockets.Depth market={pair}>
                    <ListOrderBook market={pair} />
                  </Sockets.Depth>
                </div>
              </div>
              <div className="col zb-b-r " style={{flex:'0 0 30%'}}>
                <div className="p0">
                  <Order.TradeForm side="buy" pair={pair} />
                </div>
              </div>
              <div className="col zb-b-r" style={{flex:'0 0 30%'}}>
                <div className="p0">
                  <Order.TradeForm side="sell" pair={pair} />
                </div>
              </div>
              <div className="col-auto" style={{flex:'0 0 20%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.trade_history')}
                </div>
                <div>
                  <Sockets.Trades market={pair}>
                    <TradeList market={pair} />
                  </Sockets.Trades>
                </div>
              </div>
              {
                false &&
                <div className="col-md-3 zb-b-r">
                  <Tabs className="rs no-ink-bar" forceRender={true} defaultActiveKey="sell" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
                    <Tabs.TabPane tab={<div className="fs2 p10 pl15 pr15 lh25">{intl.get('trade.sell')} {tokenL}</div>} key="sell">
                      <div className="p15 zb-b-t">
                        <Order.TradeForm side="sell" pair={pair} />
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<div className="fs2 p10 pl15 pr15 lh25">{intl.get('trade.buy')} {tokenL}</div>} key="Buy">
                      <div className="p15 zb-b-t">
                        <Order.TradeForm side="buy" pair={pair} />
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </div>

              }
            </div>
          </div>
        }
        {
          true &&
          <div className="zb-b">
            <div className="row align-items-stretch gutter-0 bg-white">
              <div className="col-auto zb-b-r" style={{flex:'0 0 30%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.order_book')}
                </div>
                <div>
                  <Sockets.Depth market={pair}>
                    <ListOrderBook market={pair} />
                  </Sockets.Depth>
                </div>
              </div>
              {
                true &&
                <div className="col zb-b-r" style={{flex:'0 0 40%'}}>
                  <div className="fs2 lh25 color-black-1 zb-b-b text-center ">
                    <div className="row align-items-stretch m0 gutter-10">
                      <div className="col-auto pt10 pb10 pl10 color-primary-1">
                        {intl.get('trade.buy')} {tokenL}
                      </div>
                      <div className="col-auto pt10 pb10 pl15">
                        {intl.get('trade.sell')} {tokenL}
                      </div>
                    </div>
                  </div>
                  <Order.TradeForm side="buy" pair={pair} />
                  {
                    false &&
                    <Tabs className="rs no-ink-bar" forceRender={true} defaultActiveKey="sell" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
                      <Tabs.TabPane tab={<div className="fs2 p10 pl15 pr15 lh25">{intl.get('trade.sell')} {tokenL}</div>} key="sell">
                        <div className="zb-b-t">

                        </div>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab={<div className="fs2 p10 pl15 pr15 lh25">{intl.get('trade.buy')} {tokenL}</div>} key="Buy">
                        <div className="zb-b-t">
                          <Order.TradeForm side="buy" pair={pair} />
                        </div>
                      </Tabs.TabPane>
                    </Tabs>
                  }

                </div>

              }
              <div className="col-auto" style={{flex:'0 0 30%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.trade_history')}
                </div>
                <div>
                  <Sockets.Trades market={pair}>
                    <TradeList market={pair} />
                  </Sockets.Trades>
                </div>
              </div>

            </div>
          </div>
        }

        <div className="zb-b">
          <div className="bg-white mt15">
            <Tabs defaultActiveKey="orders" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
              <Tabs.TabPane tab={<div className="fs16 lh20">{intl.get('tabs.my_open_orders')}</div>} key="orders">
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
              <Tabs.TabPane tab={<div className="fs16 lh20">{intl.get('tabs.my_recent_trades')}</div>} key="trades">
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
        </div>
        <div className="mb50"></div>
      </div>
    </Layout>
  )
}
