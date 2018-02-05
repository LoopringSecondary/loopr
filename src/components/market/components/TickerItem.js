import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon,Popover } from 'antd';
import TickerListTable from './TickerListTable'


const LooprTicker = (props)=>{
	const TickerHeader = ()=>(
		<Popover
		  title={null}
		  placement="bottom"
		  arrowPointAtCenter={false}
		  content={
		    <div className="" style={{minWidth:'420px'}}>
		      <TickerListTable />
		    </div>
		  }
		>
		  <div className="row align-items-center pt15 pb15" style={{background:'rgba(0,0,0,0.1)'}}>
		    <div className="col-auto pr5 pl20">
		      <Icon className="fs16 color-yellow-600" type="star" />
		    </div>
		    <div className="col">
		      <div className="fs18 color-white">LRC/ETH</div>
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
           <NumberCaption title="Latest Price" content="0.00107934 ≈ $1.200" />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Change" content={<span style={{color:'#00E831'}}>+ 10%</span>} />
         </div>
         <div className="col-auto">
          <NumberCaption title="24H Low" content="0.00116918" />
         </div>
         <div className="col-auto">
           <NumberCaption title="24H High" content="0.00089000" />
         </div>
         <div className="col-sm-6 col-lg-2">
          <NumberCaption title="24H Volume" content="4,382.34 ETH" />
         </div>
      </div>
  )
}
const ExchangeTicker = (props)=>{
		const ExchangeItem = (props)=>{
      return (
        <div className="row bg-white justify-content-between no-gutters pt15 pb15 pl10 pr10 mt15 mb15 ml0 mr0" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
          <div className="col-auto">
            <div className="fs16 color-grey-900">0.00107934</div>
            <div className="fs12 color-grey-400 text-truncate" style={{maxWidth:'120px'}}>Binance</div>
          </div>
          <div className="col-auto">
            <div className="fs16" style={{color:'#1DB427'}}>+ 12%</div>
            <div className="fs12 color-grey-400 ">24H Change</div>
          </div>
          <div className="col-auto">
            <div className="fs16 color-grey-900">12,127.62 ETH</div>
            <div className="fs12 color-grey-400">24H Volume</div>
          </div>
        </div>
      )
    }
		return (
			<div className="row ml0 mr0">
			   <div className="col-sm-6 col-lg-4 pl0">
			     <ExchangeItem />
			   </div>
			   <div className="col-sm-6 col-lg-4">
			     <ExchangeItem />
			   </div>
			   <div className="col-sm-6 col-lg-4 pr0">
			     <ExchangeItem />
			   </div>
			</div>
		)
}

function Ticker() {
  return (
  	<div>
  		<div className="" style={{background:'#0077FF'}}>
  		  <div className="container">
  		    <LooprTicker />
  		  </div>
  		</div>
  		<div className="container">
  			<ExchangeTicker />
  		</div>
  	</div>
    
  );
}

export default Ticker;
