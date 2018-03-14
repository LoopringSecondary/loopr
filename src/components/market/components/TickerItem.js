import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon,Popover } from 'antd';
import TickerListTable from './TickerListTable'
import TickersContainer from '../../../modules/tickers/ListContainer'
import Currency from '../../../modules/settings/CurrencyContainer'

const LooprTicker = ({pair='',ticker={},price=0})=>{
  const tokenL = pair.split('-')[0]
  const tokenR = pair.split('-')[1]
  const priceValue = (
    <span className="fs10">
      ≈
      <Currency />
      {(price*ticker.last).toFixed(3)}
    </span>
  )

	const TickerHeader = ()=>(
		<Popover
		  title={null}
		  placement="bottom"
		  arrowPointAtCenter={false}
		  content={
		    <div className="" style={{minWidth:'420px'}}>
          <TickersContainer>
		        <TickerListTable />
          </TickersContainer>
		    </div>
		  }
		>
		  <div className="row align-items-center pt15 pb15" style={{background:'rgba(0,0,0,0.1)'}}>
		    <div className="col-auto pr5 pl20">
		      <Icon className="fs16 color-yellow-600" type="star" />
		    </div>
		    <div className="col">
		      <div className="fs18 color-white">{pair}</div>
		      <div className="fs12 color-white opacity-70">Select Market Pair <Icon hidden className="" type="down" /></div>
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
           <NumberCaption title="Latest Price" content={<div>{ticker.last || 0} {priceValue}</div>} />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Change" content={<span style={{fontcolor:'#00E831'}}>{ticker.change || 0}</span>} />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Low" content={ticker.low || 0} />
         </div>
         <div className="col-auto">
           <NumberCaption title="24H High" content={ticker.high || 0} />
         </div>
         <div className="col-sm-6 col-lg-2">
          <NumberCaption title={<div>24H Volume <span className="fs10">/ {tokenR}</span></div>} content={<div>{`${ticker.vol || 0}`} </div>} />
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
        <div className="row bg-white justify-content-between no-gutters pt15 pb15 pl10 pr10 ml0 mr0" style={{border:'1px solid #dadada',borderRadius:'4px'}}>
          <div className="col-auto">
            <div className="fs16 color-grey-900">
              {ticker.last} {priceValue}
              </div>
            <div className="fs14 color-grey-400 text-truncate text-capitalize" style={{maxWidth:'120px'}}>{ticker.exchange}</div>
          </div>
          <div className="col-auto">
            <div className="fs16" style={{color:'#1DB427'}}>{ticker.change}</div>
            <div className="fs14 color-grey-400 ">24H Change</div>
          </div>
          <div className="col-auto">
            <div className="fs16 color-grey-900">{ticker.vol || (ticker.amount*ticker.last).toFixed(5)}</div>
            <div className="fs14 color-grey-400">24H Volume<span className="fs10"> / {tokenR}</span></div>
          </div>
        </div>
      )

}

function Ticker({pair,tickersByPair,prices}) {
  const tokenL = pair.split('-')[0]
  const tokenR = pair.split('-')[1]
  const token = prices.getTokenBySymbol(tokenR)
  console.log('token')
  return (
  	<div>
  		<div className="" style={{background:'#0077FF'}}>
  		  <div className="container">
  		    <LooprTicker pair={pair} ticker={tickersByPair.loopr} price={token.price} />
  		  </div>
  		</div>
  		<div className="container">
        <div className="row ml0 mr0 mt15 mb15">
           {
            tickersByPair.binance &&
            <div className="col pl0">
              <ExchangeItem pair={pair} ticker={tickersByPair.binance} price={token.price} />
            </div>
           }
           {
            tickersByPair.okex &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={tickersByPair.okex} price={token.price} />
            </div>
           }
           {
            tickersByPair.huobi &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={tickersByPair.huobi} price={token.price} />
            </div>
           }

        </div>
  		</div>
  	</div>

  );
}

export default Ticker;
