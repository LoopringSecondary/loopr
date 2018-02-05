import React from 'react';
import { Icon,Popover,Tabs,Card,Steps } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Layout from '../../layout/Layout'
import Market from '../market/components'

export default function Home(props){
  const { children } = props
  return (
   <Layout {...props}>
    <Market.TickerItem></Market.TickerItem>
    <div className="container">
       <Card title="Order Form" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
        <div className="row justify-content-around">
          <div className="col-sm-6 pl40 pr40 zb-b-r">
            <Order.TradeForm side="sell" pair="LRC/ETH" />
          </div>
          <div className="col-sm-6 pl40 pr40">
            <Order.TradeForm side="buy" pair="LRC/ETH" />
          </div>
        </div>
       </Card>
       <div className="bg-white mt15" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
         <Tabs defaultActiveKey="open" animated={false} tabBarStyle={{marginBottom:'0px'}}>
           <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Open Orders</div>} key="open">
             <div className="pt15">
               <Order.List filters={{pair:'LRC/ETH',status:'all',side:'sell'}} />
             </div>
           </Tabs.TabPane>
           <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Recent Trades</div>} key="trade">
             <div className="pt15">
               <Trade.List filters={{pair:'LRC/ETH',side:'all'}} />
             </div>
           </Tabs.TabPane>
         </Tabs>
       </div>
    </div>
   </Layout>
  )
}