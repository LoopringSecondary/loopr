import React from 'react';
import { Tabs } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Ring from '../rings/pages'

export default function Home(props){
  const { children } = props
  return (
    <div className="zb-b bg-white">
      <Tabs defaultActiveKey="0" animated={false} tabBarStyle={{paddingLeft:'50px',marginBottom:'0px'}}>
        <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Assets</div>} key="0">
         <div className="row no-gutters">
           <div className="col-3 zb-b-r">
            <Token.ListSidebar />
           </div>
           <div className="col-9">
            <Transaction.ListStand />
           </div>
         </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Orders</div>} key="3">
          <div className="pt15 pb15 pl20 pr20">
            <Order.List />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trades</div>} key="4">
          <div className="pt15 pb15 pl20 pr20">
            <Trade.List />
          </div>
        </Tabs.TabPane>
        
      </Tabs>
    </div>
    
  )
}