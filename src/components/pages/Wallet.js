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
    <div className="pt10 pl20 pr20 pb20 bg-white">
      <Tabs defaultActiveKey="0" animated={false} >
        <Tabs.TabPane tab={<div className="fs20 pb5">Assets</div>} key="0">
         <div className="row">
           <div className="col-3 zb-b-r pr10">
            <Token.ListSidebar />
           </div>
           <div className="col-9">
            <Transaction.ListStand />
           </div>
         </div>
        </Tabs.TabPane>
        {
          false &&
          <Tabs.TabPane tab={<div className="fs20 pb5">Assets</div>} key="1">
           <div className="row">
             <div className="col-12">
              <Token.List />
             </div>
           </div>
          </Tabs.TabPane>
        }
        {
          false &&
          <Tabs.TabPane tab={<div className="fs20 pb5">Transactions</div>} key="2">
            <Transaction.List />
          </Tabs.TabPane>
        }

        <Tabs.TabPane tab={<div className="fs20 pb5">Orders</div>} key="3">
          <div className="">
            <Order.List />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="fs20 pb5">Trades</div>} key="4">
          <Trade.List />
        </Tabs.TabPane>
        {
          false &&
          <Tabs.TabPane tab={<div className="fs20 pb5">Rings</div>} key="5">
            <Ring.List />
          </Tabs.TabPane>
        }
      </Tabs>
    </div>
    
  )
}