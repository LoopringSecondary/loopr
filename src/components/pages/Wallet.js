import React from 'react';
import { Tabs } from 'antd'
import {FormattedMessage} from 'react-intl';
import { Switch,Route,Redirect } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Ring from '../rings/pages'
import Layout from '../../layout/Layout'
import intl from 'react-intl-universal';

export default function Home(props){
  const { children,match,location } = props
  const handleTabChange = (key) => {
    switch (key) {
      case 'assets':
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
          <Tabs className="rs no-ink-bar" onChange={handleTabChange} activeKey={location.pathname.replace(`${match.path}/`, '')} animated={false}>
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 "> {intl.get("wallet.assets")}</div>} key="assets" />
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("wallet.orders")}</div>} key="orders" />
            <Tabs.TabPane tab={<div className="fs16 pl15 pr15 pt20 pb20 ">{intl.get("wallet.trades")}</div>} key="trades" />
          </Tabs>
            <Switch>
              <Route path={`${match.url}/assets`} exact render={()=>
                <div className="row no-gutters bg-white" style={{borderRadius:'4px',border:'1px solid #dadada'}}>
                  <div className="col-4 zb-b-r">
                   <Token.ListSidebar />
                  </div>
                  <div className="col-8 pb15">
                    <Transaction.ListStand />
                  </div>
                </div>
              }
              />
              <Route path={`${match.url}/orders`} exact render={()=>
                <div className="pb0 bg-white" style={{borderRadius:'4px',border:'1px solid #dadada'}}>
                  <Order.List id="orders/wallet" />
                </div>
              }
              />
              <Route path={`${match.url}/trades`}  render={()=>
                <div className="pb0 bg-white" style={{borderRadius:'4px',border:'1px solid #dadada'}}>
                  <Trade.List />
                </div>
              }
              />
              <Redirect path={`${match.url}/`} to={`${match.url}/assets`} />
            </Switch>
      </div>
      <div className="mb50"></div>
    </Layout>

  )
}
