import React from 'react';
import { Tabs } from 'antd'
import {FormattedMessage} from 'react-intl';
import { Switch,Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Ring from '../rings/pages'
import Layout from '../../layout/Layout'

export default function Home(props){
  const { children } = props
  const { dispatch, match } = props;
  const TabTilte = (props)=> <div className="fs18 pb5 pt5">{props.children}</div>
  const handleTabChange = (key) => {
    switch (key) {
      case 'assets':
        // dispatch(routerRedux.push(`${match.url}/articles`));
        window.routeActions.gotoPath(`${match.url}/assets`)
        break;
      case 'orders':
        window.routeActions.gotoPath(`${match.url}/orders`)
        break;
      case 'trades':
        window.routeActions.gotoPath(`${match.url}/trades`)
        break;
      default:
        break;
    }
  }
  return (
    <Layout {...props}>
      <div className="container">
        <div className=" ">

          <Tabs onChange={handleTabChange} defaultActiveKey="assets" animated={false} tabBarStyle={{paddingLeft:'50px',marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Assets</div>} key="assets" />
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Orders</div>} key="orders" />
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trades</div>} key="trades" />
          </Tabs>
            <Switch>
              <Route path={`${match.url}/`} exact render={()=>
                <div className="row no-gutters bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <div className="col-4 zb-b-r">
                   <Token.ListSidebar />
                  </div>
                  <div className="col-8">
                   <Transaction.ListStand />
                  </div>
                </div>
              }
              />
              <Route path={`${match.url}/assets`} exact render={()=>
                <div className="row no-gutters bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <div className="col-4 zb-b-r">
                   <Token.ListSidebar />
                  </div>
                  <div className="col-8">
                   <Transaction.ListStand />
                  </div>
                </div>
              }
              />
              <Route path={`${match.url}/orders`} exact render={()=>
                <div className="pt15 pb15 bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <Order.List />
                </div>
              }
              />
              <Route path={`${match.url}/trades`}  render={()=>
                <div className="pt15 pb15 bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <Trade.List />
                </div>
              } 
              />
            </Switch>
          {
            false &&
            <Tabs className="rs nobar" defaultActiveKey="assets" animated={false}>
              <Tabs.TabPane tab={<div className="fs18 pl0 pr20 pt30 pb20"><FormattedMessage id="page.wallet.assets"/></div>} key="assets">
               <div className="row no-gutters bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                 <div className="col-4 zb-b-r">
                  <Token.ListSidebar />
                 </div>
                 <div className="col-8">
                  <Transaction.ListStand />
                 </div>
               </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs18 pl20 pr20 pt30 pb20"><FormattedMessage id="page.wallet.orders"/></div>} key="orders">
                <div className="pt15 pb15 bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <Order.List />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs18 pl20 pr20 pt30 pb20"><FormattedMessage id="page.wallet.trades"/></div>} key="trades">
                <div className="pt15 pb15 bg-white" style={{borderRadius:'6px',border:'1px solid #dadada'}}>
                  <Trade.List />
                </div>
              </Tabs.TabPane>
            </Tabs>

          }
          
        </div>
      </div>
    </Layout>
    
  )
}