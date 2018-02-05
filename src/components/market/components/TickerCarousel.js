import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';

const TickerItem = (props)=>{
  return (
    <div className="p15 text-left" style={{background:'#0077FF'}}>
      <div className="fs16">
        <span className="color-white mr5">LRC/ETH</span>
        <span className="" style={{color:'#00E831'}}>
          <Icon type="arrow-up" />10.5%
        </span>
      </div>
      <div className="fs18">
        <span className="color-white mr5">0.003</span>
        <span className="color-white" style={{opacity:'0.6'}}>ETH</span>
      </div>

    </div>
  )
}
const TickerCarousel = (props)=>{
  return (
    <div className="position-absolute row no-gutters mb0 w-100" style={{bottom:'0px'}}>
      {
       Array(6).fill(1).map((item,index)=>
         <div className="col" key={index}>
           <TickerItem key={index} item={item} />
         </div>
       )
      }
    </div>
  )
}


export default TickerCarousel;
