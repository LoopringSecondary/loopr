import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListOrderBook(props) {
  const {className, style,depth,market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  const ListHeader = ({})=>{
    return (
      <div className="row gutter-8 pt5 pb5 zb-b-b">
        <div className="col fs12 color-black-3 text-left">
          {intl.get('global.price')} {tokenR}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'100px'}}>
          {intl.get('global.amount_label')} {tokenL}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'80px'}}>
          {intl.get('global.total')} {tokenR}
        </div>
      </div>
    )
  }
  const ListItem = ({item,side})=>{
    return (
      <div className="row gutter-8 pt5 pb5">
        {
          side === 'sell' &&
          <div className="col fs12 color-red-500 text-left">
            {Number(item[0]).toFixed(8)}
          </div>
        }
        {
          side === 'buy' &&
          <div className="col fs12 color-green-500 text-left">
            {Number(item[0]).toFixed(8)}
          </div>
        }

        <div className="col-auto fs12 color-black-2 text-center" style={{width:'100px'}}>
          {Number(item[1]).toFixed(4)}
        </div>
        <div className="col-auto fs12 color-black-2 text-center" style={{width:'80px'}}>
          {Number(item[2]).toFixed(4)}
        </div>
      </div>
    )
  }
  return (
    <div className={className} style={{...style}}>
      <ListHeader/>
      <div style={{maxHeight:'375px',overflow:'auto'}}>
        <div style={{height:'182px'}}>
          {depth && depth.sell &&
            depth.sell.map((item,index)=><ListItem key={index} item={item} side="sell" />)
          }
        </div>
        <div className="row gutter-8 pt5 zb-b-t">
          <div className="col fs12 color-black-3 text-left zb-b-b pb5">
            Spread 0.1
          </div>
        </div>
        <div style={{height:'182px'}}>
          {depth && depth.buy &&
            depth.buy.map((item,index)=><ListItem key={index} item={item} side="buy" />)
          }
        </div>
      </div>


    </div>
  )
}

export default ListOrderBook
