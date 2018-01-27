import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon,Tabs} from 'antd'
import Tokens from '../tokens/pages'
import TokensComp from '../tokens/components'
import Layout from '../../layout/Layout'

const Portfolio = (props) => {
  return (
    <Layout {...props}>
      <div style={{width: "80%",margin:"0 auto"}}>
        <div style={{textAlign:"center"}}>
          <h1>TODO</h1>
        </div>
        <div>
            <Tabs defaultActiveKey="assets" animated={false} className="rs nobar text-right">
              <Tabs.TabPane tab={<div className="fs18 pb5 pt5"><Icon type="appstore-o" /></div>} key="assets" >
                <TokensComp.ListCard />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs18 pb5 pt5"><Icon type="bars" /></div>} key="orders" >
                <Tokens.List />
              </Tabs.TabPane>
            </Tabs>
          
        </div>
      </div>
    </Layout>
  )
};


export default connect()(Portfolio)
