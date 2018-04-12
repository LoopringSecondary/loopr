import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover,Input } from 'antd';
import intl from 'react-intl-universal';

// TickersTable
// TickersTabs

const TickerTable = (props)=>{
  const {tickers,market,dispatch} = props
  const favors =  window.STORAGE.markets.getFavors()
  let items = []
  if(market === 'favorites'){
    items = tickers.items.filter(item=>{
      return favors[item.market]
    })
  }else{
    items = tickers.items.filter(item=>{
      return item.market.toLowerCase().split('-')[1] === market.toLowerCase()
    })
  }
  const keywords = tickers.filters && tickers.filters.token
  if(keywords){
    items = items.filter(item=>{
        return item.market.toUpperCase().indexOf(keywords.toUpperCase()) > -1
    })
  }
  const updateOrders = (pair)=>{
    dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade',
        filters:{
          market:pair
        }
      }
    })

  }
  const updateTrades = (pair)=>{
    dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade',
        filters:{
          market:pair
        }
      }
    })
  }

  const gotoTrade = (pair,e)=>{
    e.preventDefault()
    updateOrders(pair)
    updateTrades(pair)
    window.STORAGE.markets.setCurrent(pair)
    window.routeActions.gotoPath(`/trade/${pair}`)
  }

  return (
    <div className="mb15" style={{height:'400px',overflow:'auto'}}>
      <table className="ticker-list-table">
        <tbody>
          <tr className="">
            <th className="fs12 border-0 color-black-2 "></th>
            <th className="fs12 border-0 color-black-2">{intl.get('ticker.market')}</th>
            <th className="fs12 border-0 color-black-2">{intl.get('ticker.last')}</th>
            <th className="fs12 border-0 color-black-2">{intl.get('ticker.change')}</th>
            <th className="fs12 border-0 color-black-2">{intl.get('ticker.vol')}</th>
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
                <td className="fs12 border-0 color-black-2">{Number(item.vol).toFixed(4)} {market==='favorites' ? '' : market}</td>
              </tr>
            )
          }
          {
            items.length == 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center">{intl.get('global.no_data')}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

  )
}

const TickerTabs = ({tickersByLoopring:tickers,dispatch})=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  const search = (e)=>{
    const value = e.target.value
    const filters = {
      token:value.toUpperCase(),
    }
    tickers.filtersChange({filters})
  }
  let marketsMap = {}
  tickers.items.forEach(ticker=>{
    let market = ticker.market.split('-')[1]
    if(!marketsMap[market]){
      marketsMap[market] = true
    }
  })
  let markets = Object.keys(marketsMap)

  const keywords = tickers.filters && tickers.filters.token
  const SearchInput = (
      <div className="pr10 tickers-search-input" style={{paddingTop:'0px'}}>
       <Input
        style={{width:'90px'}} className="" size="small" onChange={search} value={keywords}
        prefix={<Icon type="search" />}
       />
      </div>
  )
  const favors =  window.STORAGE.markets.getFavors()
  let favoredNumber = 0
  for (let key in favors ){
    if(favors[key]){
      favoredNumber += 1
    }
  }
  const activeTab = favoredNumber > 0 ? 'favorites' : 'WETH'

  return (
    <Tabs className="tickers-market-tabs" defaultActiveKey={activeTab} animated={false} tabBarExtraContent={SearchInput}>
      <Tabs.TabPane tab={tab(intl.get('ticker.favorites'))} key="Favorites">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="favorites" dispatch={dispatch} />
        </div>
      </Tabs.TabPane>
      {
        markets.map((market,index)=>
          <Tabs.TabPane tab={tab(market)} key={market}>
            <div className="pl10 pr10">
              <TickerTable tickers={tickers} market={market} dispatch={dispatch}  />
            </div>
          </Tabs.TabPane>
        )
      }

    </Tabs>
  )
}

export default TickerTabs

