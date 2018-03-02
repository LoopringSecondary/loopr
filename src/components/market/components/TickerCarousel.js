import React from 'react';
import { connect } from 'dva';
import { Icon,Carousel } from 'antd';
const TickerItem = ({item})=>{
  return (
    <div className="p15 text-left ticker-item-carousel">
      <div className="fs16">
        <span className="color-white mr10">{item.market}</span>
        <span className="" style={{color:'#00E831'}}>
          <Icon type="arrow-up" />{item.change}
        </span>
      </div>
      <div className="fs18">
        <span className="color-white mr5">{Number(item.last).toFixed(4)}</span>
        <span className="color-white" style={{opacity:'0.6'}}>{item.market.split('-')[1]}</span>
      </div>

    </div>
  )
}
const TickerCarousel = ({tickers})=>{
  const carouselProps = {
    autoplay:true,
    dots:false,
    infinite:true,
    autoplaySpeed: 1000,
    slidesToShow:6,
  }
  return (
    <div className="ticker-list-carousel">
      <Carousel  {...carouselProps}>
          {
           tickers.items.filter(item=>item.change && item.last).map((item,index)=>
             <div className="" key={index}>
               <TickerItem key={index} item={item} />
             </div>
           )
          }
      </Carousel>
    </div>
  )
}

export default TickerCarousel;
