import React from 'react';
import { Icon,Popover,Tabs,Card,Steps,Button } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import ModalContainer from '../../modules/modals/container'

const ToLogin = ({modal})=>{
  return (
    <div>
      <div className="text-center pt25 pb25">
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/unlock'})} style={{width:'255px'}} type="primary" size="large">Unlock Wallet</Button>
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/generate'})} style={{width:'255px'}} type="default" size="large">Generate Wallet</Button>
      </div>
    </div>
  )
}
export default function Home(props){
  const { children,match } = props
  const pair = match.params.pair || window.STORAGE.markets.getCurrent()
  return (
    <Layout {...props}>
      <Sockets.TickersByPair pair={pair}>
        <Sockets.Prices>
          <Market.TickerItem pair={pair} />
        </Sockets.Prices>
      </Sockets.TickersByPair>
      <div className="container">
        <Card title="Order Form" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
          <div className="row justify-content-around">
            <div className="col-sm-6 pl40 pr40 zb-b-r">
              <Order.TradeForm side="buy" pair={pair} />
            </div>
            <div className="col-sm-6 pl40 pr40">
              <Order.TradeForm side="sell" pair={pair} />
            </div>
          </div>
        </Card>
        <div className="bg-white mt15" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
          <Tabs defaultActiveKey="open" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Open Orders</div>} key="open">
              <div className="pt15">
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
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Recent Trades</div>} key="trade">
              <div className="pt15">
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
