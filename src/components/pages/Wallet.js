import React from 'react';
import { Tabs } from 'antd'
import {FormattedMessage} from 'react-intl';
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Ring from '../rings/pages'
import Layout from '../../layout/Layout'

export default function Home(props){
  const { children } = props
  const TabTilte = (props)=> <div className="fs18 pb5 pt5">{props.children}</div>
  return (
    <Layout {...props}>
      <div className="container">
        <div className=" ">
          <Tabs className="rs nobar" defaultActiveKey="assets" animated={false}>
            <Tabs.TabPane tab={<div className="fs18 pl0 pr20 pt30 pb20"><FormattedMessage id="page.wallet.assets"/></div>} key="assets">
             <div className="row no-gutters bg-white zb-b">
               <div className="col-4 zb-b-r">
                <Token.ListSidebar />
               </div>
               <div className="col-8">
                <Transaction.ListStand />
               </div>
             </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pl0 pr20 pt30 pb20"><FormattedMessage id="page.wallet.orders"/></div>} key="orders">
              <div className="pt15 pb15 bg-white">
                <Order.List />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pl0 pr20 pt30 pb20"><FormattedMessage id="page.wallet.trades"/></div>} key="trades">
              <div className="pt15 pb15 bg-white">
                <Trade.List />
              </div>
            </Tabs.TabPane>
          </Tabs>
          {
            false &&
            <Tabs defaultActiveKey="assets" animated={false} tabBarStyle={{paddingLeft:'50px',marginBottom:'0px'}}>
              <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Assets</div>} key="assets" />
              <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Orders</div>} key="orders" />
              <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trades</div>} key="trades" />
            </Tabs>
          }
        </div>
      </div>
    </Layout>
    
  )
}