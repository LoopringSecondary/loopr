import React from 'react';
import { connect } from 'dva';
import { Icon,Carousel } from 'antd';
const TickerItem = ({item})=>{
  return (
    <div className="p15 text-left ticker-item-carousel">
      <div className="fs16">
        <span className="color-white mr10">{item.market}</span>
        <span className="" style={{color:'#00E831'}}>
          {
            false &&
            <Icon type="arrow-up" />
          }
          {item.change || '0%'}
        </span>
      </div>
      <div className="">
        <span className="color-white mr5 fs18">{Number(item.last).toFixed(6)}</span>
        <span className="color-white fs16" style={{opacity:'0.6'}}>{item.market.split('-')[1]}</span>
      </div>

    </div>
  )
}
const TickerCarousel = (props)=>{
  const tickers = props.tickersByLoopring
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
           tickers.items.map((item,index)=>
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
