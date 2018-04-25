import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {className, style,items=[],market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  const ListHeader = ({})=>{
    return (
      <div className="row bg-grey-50 pb5 pt5 gutter-8">
        <div className="col fs12 color-black-3 text-left">
          {intl.get('global.price')} {tokenR}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'100px'}}>
          {intl.get('global.amount')} {tokenL}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'80px'}}>
          {}{intl.get('global.time')}
        </div>
      </div>
    )
  }
  const ListItem = ({item,key})=>{
    return (
      <div className="row pt5 pb5 gutter-8">
        <div className="col fs12 color-green-500 text-left">
          0.00118642
        </div>
        <div className="col-auto fs12 color-black-2 text-center" style={{width:'100px'}}>
          10
        </div>
        <div className="col-auto fs12 color-black-2 text-center" style={{width:'80px'}}>
          21:23:55
        </div>
      </div>
    )
  }
  return (
    <div className={className} style={{...style}}>
      <ListHeader/>
      <div style={{maxHeight:'375px',overflow:'auto'}}>
        {
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=><ListItem key={index} item={item} />)
        }
      </div>
    </div>
  )
}

export default ListBlock
