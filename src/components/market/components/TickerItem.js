import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon,Popover } from 'antd';
import TickerListTable from './TickerListTable'
import TickersContainer from '../../../modules/tickers/ListContainer'


const LooprTicker = ({pair='',ticker={}})=>{
  const tokenL = pair.split('-')[0]
  const tokenR = pair.split('-')[1]
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
      <div className="fs18 color-white">{content}</div>
      <div className="fs12 color-white opacity-70">{title}</div>
    </div>
  )

  return (
    	<div className="row align-items-center ml0 mr0 justify-content-between">
         <div className="col-auto">
           <TickerHeader />
         </div>
         <div className="col-auto">
           <NumberCaption title="Latest Price" content={<div>{ticker.last} ￥20.00</div>} />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Change" content={<span style={{fontcolor:'#00E831'}}>{ticker.change || 0}</span>} />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Low" content={ticker.low} />
         </div>
         <div className="col-auto">
           <NumberCaption title="24H High" content={ticker.high} />
         </div>
         <div className="col-sm-6 col-lg-2">
          <NumberCaption title="24H Volume" content={`${ticker.vol} ${tokenR}`} />
         </div>
      </div>
  )
}
const ExchangeItem = ({pair='',ticker={}})=>{
    const tokenL = pair.split('-')[0]
    const tokenR = pair.split('-')[1]
    return (
        <div className="row bg-white justify-content-between no-gutters pt15 pb15 pl10 pr10 ml0 mr0" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
          <div className="col-auto">
            <div className="fs16 color-grey-900">{ticker.last}</div>
            <div className="fs14 color-grey-400 text-truncate text-capitalize" style={{maxWidth:'120px'}}>{ticker.exchange}</div>
          </div>
          <div className="col-auto">
            <div className="fs16" style={{color:'#1DB427'}}>{ticker.change}</div>
            <div className="fs14 color-grey-400 ">24H Change</div>
          </div>
          <div className="col-auto">
            <div className="fs16 color-grey-900">{ticker.vol} {tokenR}</div>
            <div className="fs14 color-grey-400">24H Volume</div>
          </div>
        </div>
      )

}

function Ticker({pair,socketTicker}) {
  console.log('ticker re-render',pair,socketTicker)
  return (
  	<div>
  		<div className="" style={{background:'#0077FF'}}>
  		  <div className="container">
  		    <LooprTicker pair={pair} ticker={socketTicker.loopr} />
  		  </div>
  		</div>
  		<div className="container">
        <div className="row ml0 mr0 mt15 mb15">
           {
            socketTicker.binance &&
            <div className="col pl0">
              <ExchangeItem pair={pair} ticker={socketTicker.binance} />
            </div>
           }
           {
            socketTicker.okex &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={socketTicker.okex} />
            </div>
           }
           {
            socketTicker.huobi &&
            <div className="col pr0">
              <ExchangeItem pair={pair} ticker={socketTicker.huobi} />
            </div>
           }

        </div>
  		</div>
  	</div>

  );
}

export default Ticker;
