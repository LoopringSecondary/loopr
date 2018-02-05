import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover } from 'antd';

const TickerTable = ({tickers,market})=>{
  const items = tickers.items.filter(item=>{
    return item.market.toLowerCase().split('-')[1] === market.toLowerCase()
  })
  const gotoTrade = (pair,e)=>{
    e.preventDefault()
    window.routeActions.gotoPath(`/trade/${pair}`)
  }
  return (
    <div className="mb15" style={{height:'400px',overflow:'auto'}}>
      <table className="ticker-list-table">
        <tbody>
          <tr className="">
            <th className="fs12 border-0 "></th>
            <th className="fs12 border-0 ">Pair</th>
            <th className="fs12 border-0 ">Price</th>
            <th className="fs12 border-0 ">Change</th>
            <th className="fs12 border-0 ">Volume</th>
          </tr>
          {
            items.length>0 && items.map((item,index)=>
              <tr key={index}>
                {
                  item.isFavored &&
                  <td className="fs12 border-0 color-yellow-700"><Icon type="star" /></td>
                }
                {
                  !item.isFavored &&
                  <td className="fs12 border-0 color-grey-300"><Icon type="star" /></td>
                }
                <td className="fs12 border-0 "><a href="" onClick={gotoTrade.bind(this,item.market)}>{item.market}</a></td>
                <td className="fs12 border-0 color-green-600">{item.last}</td>
                <td className="fs12 border-0 color-green-600">{item.change}</td>
                <td className="fs12 border-0 ">{Number(item.vol).toFixed(4)} {market}</td>
              </tr>
            )
          }
          {
            items.length == 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center"> No Data</td>
            </tr>
          }

        </tbody>
      </table>
    </div>
    
  )
}

const TickerTabs = ({tickers})=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  return (
    <Tabs defaultActiveKey="Favorites" animated={false} >
      <Tabs.TabPane tab={tab("Favorites")} key="Favorites">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="favorites" />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('WETH')} key="WETH">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="WETH"  />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('LRC')} key="LRC">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="LRC"  />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('BTC')} key="BTC">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="BTC" />
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default TickerTabs

