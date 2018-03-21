import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon,Popover } from 'antd';
import TickerListTabs from './TickerListTabs'
import Sockets from '../../../modules/socket/containers'
import Currency from '../../../modules/settings/CurrencyContainer'
import intl from 'react-intl-universal'

let fm = {}
fm.getVolume = (value)=>{
  if(value>1000){
    return value.toFixed(0)
  }
  if(value<=1000 && value>=1){
    return value.toFixed(1)
  }
  if(value<1 && value>=0.001){
    return value.toFixed(5)
  }
  if(value<0.001 & value>0){
    return value.toFixed(8)
  }
  if(value===0){
    return 0.00
  }
}
fm.getPrice = (value)=>{
  if(value>1000){
    return value.toFixed(2)
  }
  if(value<=1000 && value>=1){
    return value.toFixed(2)
  }
  if(value<1 && value>=0.001){
    return value.toFixed(5)
  }
  if(value<0.001 & value>0){
    return value.toFixed(8)
  }
  if(value===0){
    return 0.00
  }
}

const LooprTicker = ({pair='',tickers={},price=0})=>{
  const tokenL = pair.split('-')[0]
  const tokenR = pair.split('-')[1]
  const ticker = tickers.loopr || {} // fix bug: when init loopr is null
  const priceValue = (
    <span className="fs10">
      ≈
      <Currency />
      {(price*ticker.last).toFixed(3)}
    </span>
  )
  const favors = window.STORAGE.markets.getFavors()

	const TickerHeader = ()=>(
		<Popover
		  title={null}
		  placement="bottom"
		  arrowPointAtCenter={false}
		  content={
		    <div className="" style={{minWidth:'420px'}}>
          <Sockets.TickersByLoopring>
		        <TickerListTabs />
          </Sockets.TickersByLoopring>
		    </div>
		  }
		>
		  <div className="row align-items-center pt15 pb15" style={{background:'rgba(0,0,0,0.1)'}}>
		    <div className="col-auto pr5 pl20">
          {
            favors[pair] &&
          <Icon onClick={tickers.toggleFavor} className="fs16 color-yellow-600 pointer" type="star" />
          }
          {
            !favors[pair] &&
		      <Icon onClick={tickers.toggleFavor} className="fs16 color-white pointer" type="star" />
          }

		    </div>
		    <div className="col">
		      <div className="fs18 color-white">{pair}</div>
		      <div className="fs12 color-white opacity-70">{intl.get('exchanges.loopr')} <Icon hidden className="" type="down" /></div>
		    </div>
		    <div className="col-auto">
		      <Icon type="caret-down" className="color-white" />
		    </div>
		  </div>
		</Popover>
	)
  const NumberCaption = ({title,content})=>(
    <div className="pt15 pb15">
      <div className="fs20 color-white">{content}</div>
      <div className="fs12 color-white opacity-70">{title}</div>
    </div>
  )
  return (
    	<div className="row align-items-center ml0 mr0 justify-content-between">
         <div className="col-auto">
           <TickerHeader />
         </div>
         <div className="col-auto">
           <NumberCaption title={`24H ${intl.get('ticker.last')}`} content={<div>{ticker.last || 0} {priceValue}</div>} />
         </div>
         <div className="col-auto">
          <NumberCaption title={`24H ${intl.get('ticker.change')}`} content={<span style={{fontcolor:'#00E831'}}>{ticker.change || 0}</span>} />
         </div>
         <div className="col-auto">
          <NumberCaption title={`24H ${intl.get('ticker.low')}`} content={ticker.low || 0} />
         </div>
         <div className="col-auto">
           <NumberCaption title={`24H ${intl.get('ticker.high')}`} content={ticker.high || 0} />
         </div>
         <div className="col-sm-6 col-lg-2">
          <NumberCaption title={<div>24H {intl.get('ticker.vol')} <span className="fs10">/ {tokenR}</span></div>} content={<div>{`${ticker.vol || 0}`} </div>} />
         </div>
      </div>
  )
}
const ExchangeItem = ({pair='',ticker={},price=0})=>{
    const tokenL = pair.split('-')[0]
    const tokenR = pair.split('-')[1]
    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {(price*ticker.last).toFixed(3)}
      </span>
    )
    return (
        <div className="row bg-white justify-content-between no-gutters pt15 pb15 pl10 pr10 ml0 mr0" style={{border:'1px solid #dadada',borderRadius:'3px'}}>
          <div className="col-auto">
            <div className="fs16 color-grey-800">
              {fm.getPrice(ticker.last)} {priceValue}
              </div>
            <div className="fs12 color-grey-400 text-truncate text-capitalize" style={{maxWidth:'120px'}}>
            {intl.get(`exchanges.${ticker.exchange}`)}
            </div>
          </div>
          <div className="col-auto text-right">
            <div className="fs16" style={{color:'#1DB427'}}>{ticker.change}</div>
            <div className="fs12 color-grey-400 ">24H {intl.get('ticker.change')}</div>
          </div>
          <div className="col-auto text-right">
            <div className="fs16 color-grey-800">{fm.getVolume(ticker.vol) || fm.getVolume(ticker.amount*ticker.last) }</div>
            <div className="fs12 color-grey-400">24H {intl.get('ticker.vol')}</div>
          </div>
        </div>
      )

}

function Ticker({pair,tickersByPair:tickers={},prices={}}) {
  const tokenL = pair.split('-')[0]
  const tokenR = pair.split('-')[1]
  const token = prices.getTokenBySymbol(tokenR,true)
  return (
  	<div>
  		<div className="" style={{background:'#0077FF'}}>
  		  <div className="container">
  		    <LooprTicker pair={pair} tickers={tickers} price={token.price} />
  		  </div>
  		</div>
  		<div className="container">
        <div className="row ml0 mr0 mt15 mb15">
           {
            tickers.binance &&
            <div className="col pl0">
              <ExchangeItem pair={pair} ticker={tickers.binance} price={token.price} />
            </div>
           }
           {
            tickers.okex &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={tickers.okex} price={token.price} />
            </div>
           }
           {
            tickers.huobi &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={tickers.huobi} price={token.price} />
            </div>
           }

        </div>
  		</div>
  	</div>

  );
}

export default Ticker;
