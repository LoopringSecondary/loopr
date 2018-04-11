import React from 'react';
import { connect } from 'dva';
import { Icon,Carousel } from 'antd';
const TickerItem = ({item})=>{
  return (
    <div className="p15 text-left ticker-item-carousel">
      <div className="row align-items-center">
        <div className="col">
          <div className="fs2">
            <span className="color-white mr10">{item.market}</span>
            <span className="" style={{color:'#00E831'}}>
              <Icon type="arrow-up" />
              {item.change || '0%'}
            </span>
          </div>
          <div className="">
            <span className="color-white-3 mr5 fs3">{Number(item.last).toFixed(6)}</span>
            <span className="color-white-3 fs3" >{item.market.split('-')[1]}</span>
          </div>
        </div>
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
    autoplaySpeed: 2000,
    slidesToShow:6,
  }
  const ifDark = window.location && window.location.href && window.location.href.indexOf('dark') > -1
  return (
    <div className={`ticker-list-carousel ${ifDark ? ' bg-black' : ' bg-blue'}`}>
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
