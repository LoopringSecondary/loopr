import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover,Input } from 'antd';
import intl from 'react-intl-universal';
import TickerTrend from 'Loopr/TickerTrend'
const tickerFm = window.uiFormatter.TickerFormatter

const TickerTable = (props)=>{
  const {tickers,market,dispatch} = props
  const favors =  window.STORAGE.markets.getFavors()
  const availableTickers = (tickers && tickers.items) ? tickers.items.filter(item=>item.label === 'whitelist') : []
  const sorter = (a,b)=>{
    if(a.vol === b.vol ){
      if(a.last === b.last){
        return b.market > a.market ? -1 : 1
      }else{
        return Number(b.last) - Number(a.last)
      }
    }else{
      return Number(b.vol) - Number(a.vol)
    }
  }
  availableTickers.sort(sorter)
  let items = []
  if(market === 'favorites'){
    items = availableTickers.filter(item=>{
      return favors[item.market]
    })
  } else {
    items = availableTickers.filter(item=>{
      return item.market.toLowerCase().split('-')[1] === market.toLowerCase()
    })
  }
  const keywords = tickers.filters && tickers.filters.token
  if(keywords){
    items = tickers.items.filter(item=>{
        return item.market.toUpperCase().indexOf(keywords.toUpperCase()) > -1
    })
  }
  items.sort(sorter)
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
  const toggleFavor= (pair,e)=>{
    e.preventDefault()
    e.stopPropagation()
    tickers.toggleFavor(pair)
  }

  return (
    <div className="mb15" style={{minWidth:'400px',maxHeight:'400px',overflow:'auto'}}>
      {market === 'innovate' && <div className="fs12 p10 bg-blue-50 mb10 ">
        <div className="row no-gutters">
          <div className="col">
            {intl.get('ticker.new_listing')}
          </div>
          <div className="col-auto">
            <a href='https://goo.gl/forms/2RUdyJxOPTdSBkbZ2' target="_blank">{intl.get('ticker.apply')}</a>
          </div>
        </div>
      </div>}
      <table className="ticker-list-table">
        <tbody>
          <tr className="">
            <th className="fs14 border-0 color-black-3" style={{paddingLeft:"28px"}}>{intl.get('ticker.market')}</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.last')}</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.change')}/24H</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.vol')}/24H</th>
          </tr>
          {
            items.length>0 && items.map((item,index)=>
              <tr key={index} className="cursor-pointer" onClick={gotoTrade.bind(this,item.market)}>
                <td className="fs12 border-0 ">
                  {
                    favors[item.market] &&
                      <Icon className="pointer color-yellow-700 fs12 mr5" onClick={toggleFavor.bind(this,item.market)} type="star" />
                  }
                  {
                    !favors[item.market] &&
                    <Icon className="pointer color-grey-300 fs12 mr5" onClick={toggleFavor.bind(this,item.market)} type="star" />
                  }
                  {item.market}
                </td>
                <td className="fs12 border-0 color-balck-2">
                  <TickerTrend side={tickerFm.getChangeSide(item.change)}>
                    {item.last || 0.00}
                  </TickerTrend>
                </td>
                <td className="fs12 border-0 color-balck-2">
                  <TickerTrend side={tickerFm.getChangeSide(item.change)}>
                    {item.change || 0}
                  </TickerTrend>
                </td>
                <td className="fs12 border-0 color-black-2">{Number(item.vol).toFixed(4)} {item.market.split('-')[1]}</td>
              </tr>
            )
          }
          {
            items.length === 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center color-black-3">{intl.get('global.no_data')}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

  )
}

const TickerTabs = ({tickersOfSource:tickers,dispatch})=>{
  const search = (e)=>{
    const value = e.target.value
    const filters = {
      token:value.toUpperCase(),
    }
    tickers.filtersChange({filters})
  }
  const allTickers = (tickers && tickers.items) ? tickers.items.filter(item=>item.label === 'whitelist') : []
  const sorter = (a,b)=>{
    if(a.vol === b.vol ){
      if(a.last === b.last){
        return b.market > a.market ? -1 : 1
      }else{
        return Number(b.last) - Number(a.last)
      }
    }else{
      return Number(b.vol) - Number(a.vol)
    }
  }
  allTickers.sort(sorter)
  // tickers.items = allTickers
  const marketGroups = {}
  allTickers.forEach(item=>{
    const market = item.market.split('-')
    let group = marketGroups[market[1]]
    if(group){
      group.push(item)
    } else {
      group = [item]
    }
    marketGroups[market[1]] = group
  })
  const marketItems = []
  const tab = (text)=> <div className="fs16 font-weight-bold">{text}</div>
  if(marketGroups && Object.keys(marketGroups).length > 0) {
    const keys = Object.keys(marketGroups)
    const wethIndex = keys.findIndex(item=> item === 'WETH')
    if(wethIndex > -1) {
      keys.splice(wethIndex, 1);
      marketItems.push(
        <Tabs.TabPane tab={tab('WETH')} key={'WETH'}>
          <div className="pl10 pr10">
            <TickerTable tickers={tickers} market={'WETH'} dispatch={dispatch}  />
          </div>
        </Tabs.TabPane>
      )
    }
    const lrcIndex = keys.findIndex(item=> item === 'LRC')
    if(lrcIndex > -1) {
      keys.splice(lrcIndex, 1);
      marketItems.push(
        <Tabs.TabPane tab={tab('LRC')} key={'LRC'}>
          <div className="pl10 pr10">
            <TickerTable tickers={tickers} market={'LRC'} dispatch={dispatch}  />
          </div>
        </Tabs.TabPane>
      )
    }
    keys.forEach(item => {
      marketItems.push(
        <Tabs.TabPane tab={tab(item)} key={item}>
          <div className="pl10 pr10">
            <TickerTable tickers={tickers} market={item} dispatch={dispatch}  />
          </div>
        </Tabs.TabPane>
      )
    })
  }

  const keywords = tickers.filters && tickers.filters.token
  const SearchInput = (
      <div className="pr10 pl25 tickers-search-input" style={{paddingTop:'5px'}}>
       <Input
        style={{width:'100px'}} className="" size="small" onChange={search} value={keywords}
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
    <Tabs
      className="tickers-market-tabs"
      defaultActiveKey={activeTab}
      animated={false}
      tabBarExtraContent={SearchInput}
      onTabClick={() => {
        tickers.filtersChange({'token':''})
      }}
    >
      {
        marketItems && marketItems.length > 0 &&
        <Tabs.TabPane tab={tab(intl.get('global.favorites'))} key="favorites">
          <div className="pl10 pr10">
            <TickerTable tickers={tickers} market="favorites" dispatch={dispatch}/>
          </div>
        </Tabs.TabPane>
      }
      {marketItems}
    </Tabs>
  )
}

export default TickerTabs

