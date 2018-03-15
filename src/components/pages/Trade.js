import React from 'react';
import { Icon,Popover,Tabs,Card,Steps } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import PlaceOrderContainer from '../../modules/orders/models/PlaceOrderContainer'
import Sockets from '../../modules/socket/containers'
import SettingsContainer from '../../modules/settings/container'

export default function Home(props){
  const { children,match } = props
  const pair = match.params.pair || 'LRC-WETH'
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
              <SettingsContainer>
                <PlaceOrderContainer id="buy">
                  <Sockets.Prices>
                    <Sockets.Assets>
                      <Sockets.TickersByLoopring>
                        <Sockets.TickersByPair>
                          <Order.TradeForm side="buy" pair={pair} />
                        </Sockets.TickersByPair>
                      </Sockets.TickersByLoopring>
                    </Sockets.Assets>
                  </Sockets.Prices>
                </PlaceOrderContainer>
              </SettingsContainer>
            </div>
            <div className="col-sm-6 pl40 pr40">
              <SettingsContainer>
                <PlaceOrderContainer id="sell">
                  <Sockets.Prices>
                    <Sockets.Assets>
                      <Sockets.TickersByLoopring>
                        <Sockets.TickersByPair>
                          <Order.TradeForm side="sell" pair={pair} />
                        </Sockets.TickersByPair>
                      </Sockets.TickersByLoopring>
                    </Sockets.Assets>
                  </Sockets.Prices>
                </PlaceOrderContainer>
              </SettingsContainer>
            </div>
          </div>
        </Card>
        <div className="bg-white mt15" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
          <Tabs defaultActiveKey="open" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Open Orders</div>} key="open">
              <div className="pt15">
                <Order.List filters={{market:pair,status:'all',side:'sell'}} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Recent Trades</div>} key="trade">
              <div className="pt15">
                <Trade.List filters={{market:pair,side:'all'}} />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
