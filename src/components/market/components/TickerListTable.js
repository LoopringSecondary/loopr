import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover } from 'antd';

const TickerTable = (props)=>{
  return (
    <table className="table table-striped">
      <tbody>
        <tr className="">
          <th className="fs12 border-0 "></th>
          <th className="fs12 border-0 ">Pair</th>
          <th className="fs12 border-0 ">Price</th>
          <th className="fs12 border-0 ">Change</th>
          <th className="fs12 border-0 ">Volume</th>
        </tr>
        {
          [1,1,1,1,1].map((item,index)=>
            <tr key={index}>
              <td className="fs12 border-0 color-yellow-600"><Icon type="star" /></td>
              <td className="fs12 border-0 ">LRC/ETH</td>
              <td className="fs12 border-0 color-green-600">0.00113489</td>
              <td className="fs12 border-0 color-green-600">+6.17%</td>
              <td className="fs12 border-0 ">6,767.31 ETH</td>
            </tr>
          )
        }
      </tbody>
    </table>
  )
}

const TickerTabs = (props)=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  return (
    <Tabs defaultActiveKey="Favorites" animated={false} >
      <Tabs.TabPane tab={tab('Favorites')} key="Favorites">
        <div className="pl10 pr10">
          <TickerTable />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('ETH')} key="ETH">
        <div className="pl10 pr10">
          <TickerTable />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('LRC')} key="LRC">
        <div className="pl10 pr10">
          <TickerTable />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('BTC')} key="BTC">
        <div className="pl10 pr10">
          <TickerTable />
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default TickerTabs

