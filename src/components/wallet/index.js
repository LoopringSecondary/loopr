import React from 'react';
import { Tabs } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/pages'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'

export default function Home(props){
  const { children } = props
  return (
    <div className="pt10 pl20 pr20 pb20">
      <Tabs defaultActiveKey="1" animated={false} >
        <Tabs.TabPane tab={<div className="fs18 pb5">Assets</div>} key="1">
         <div className="row">
           <div className="col-12">
            <Token.List />
           </div>
         </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs18 pb5">Transactions</div>} key="2">
          <Transaction.List />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs18 pb5">Orders</div>} key="3">
          <div className="">
            <Order.List />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs18 pb5">Trades</div>} key="4">
          <Trade.List />
        </Tabs.TabPane>
      </Tabs>
    </div>
    
  )
}