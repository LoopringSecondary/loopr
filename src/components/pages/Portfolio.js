import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon,Tabs} from 'antd'
import Tokens from '../tokens/pages'
import TokensComp from '../tokens/components'
import Layout from '../../layout/Layout'
import circleChart from '../../assets/images/portfolio-circle-chart.png'
import Sockets from '../../modules/socket/containers'

const Portfolio = (props) => {
  return (
    <Layout {...props}>
      <div className="pt50 container">
        <div style={{textAlign:"center"}}>
          <img src={circleChart} alt="" style={{width:'320px'}}/>
          <div className="fs32 color-grey-900 mt10">
            USD 39,484,950
          </div>
          <div className="fs16 color-grey-500">
            Total Value
          </div>
        </div>
        <Tabs defaultActiveKey="assets" animated={false} className="rs nobar noline text-right">
          <Tabs.TabPane tab={<div className="fs18 p5 text-center"><Icon type="appstore-o" /></div>} key="assets" >
            <div className="mb10"></div>
            <Sockets.Portfolio>
              <Sockets.Prices>
                <TokensComp.ListCard />
              </Sockets.Prices>
            </Sockets.Portfolio>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs18 p5 text-center"><Icon type="bars" /></div>} key="orders" >
            <div className="mb10"></div>
            <Sockets.Portfolio>
              <Sockets.Prices>
                <Tokens.List />
              </Sockets.Prices>
            </Sockets.Portfolio>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  )
};


export default connect()(Portfolio)
