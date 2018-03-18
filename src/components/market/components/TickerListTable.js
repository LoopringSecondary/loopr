import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover,Input } from 'antd';

// TickersTable
// TickersTabs

const TickerTable = (props)=>{
  const {tickers,market} = props
  let items = tickers.items.filter(item=>{
    return item.market.toLowerCase().split('-')[1] === market.toLowerCase()
  })
  const keywords = tickers.filters && tickers.filters.token
  if(keywords){
    items = items.filter(item=>{
        return item.market.toUpperCase().indexOf(keywords.toUpperCase()) > -1
    })
  }
  const favors =  window.STORAGE.markets.getFavors()
  const gotoTrade = (pair,e)=>{
    e.preventDefault()
    window.STORAGE.markets.setCurrent(pair)
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
                  favors[item.market] &&
                  <td className="fs12 border-0 color-yellow-700">
                    <Icon className="pointer" onClick={tickers.toggleFavor.bind(this,item.market)} type="star" />
                  </td>
                }
                {
                  !favors[item.market] &&
                  <td className="fs12 border-0 color-grey-300">
                    <Icon className="pointer" onClick={tickers.toggleFavor.bind(this,item.market)} type="star" />
                  </td>
                }
                <td className="fs12 border-0 "><a href="" onClick={gotoTrade.bind(this,item.market)}>{item.market}</a></td>
                <td className="fs12 border-0 color-green-600">{item.last || 0}</td>
                <td className="fs12 border-0 color-green-600">{item.change || 0}</td>
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

const TickerTabs = ({tickersByLoopring:tickers})=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  const search = (e)=>{
    const value = e.target.value
    const filters = {
      token:value.toUpperCase(),
    }
    tickers.filtersChange({filters})
  }
  const keywords = tickers.filters && tickers.filters.token
  const SearchInput = (
      <div className="pr10" style={{marginTop:'3px'}}>
       <Input.Search className="" size="small" onChange={search} value={keywords} />
      </div>
  )
  return (
    <Tabs className="" defaultActiveKey="WETH" animated={false} tabBarExtraContent={SearchInput}>
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
    </Tabs>
  )
}

export default TickerTabs

