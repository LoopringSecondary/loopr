import React from 'react';
import { connect } from 'dva';
import { Icon,Carousel } from 'antd';
import TickerTrend from 'Loopr/TickerTrend';
const tickerFm = window.uiFormatter.TickerFormatter
const TickerItem = ({item})=>{
  const changeSide = tickerFm.getChangeSide(item.change)
  return (
    <div className="p15 text-left ticker-item-carousel">
      <div className="row align-items-center">
        <div className="col">
          <div className="fs2">
            <span className="color-white mr10">{item.market}</span>
            { item.change &&
              <TickerTrend side={changeSide}>
                <Icon type={`arrow-${changeSide}`} />
                {item.change}
              </TickerTrend>
            }
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
    draggable:true,
  }
  const ifLight = window.location && window.location.href && window.location.href.indexOf('light') > -1
  return (
    <div className={`ticker-list-carousel ${ifLight ? ' bg-blue' : ' bg-black'}`}>
      <Carousel  {...carouselProps}>
          {
           tickers.originItems.map((item,index)=>
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
