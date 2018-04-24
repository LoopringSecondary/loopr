import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {className, style,items=[]} = props;
  const ListHeader = ({})=>{
    return (
      <div className="row bg-grey-50 pt5 pb5">
        <div className="col fs12 color-black-3 text-left">
          Price
        </div>
        <div className="col-auto fs12 color-black-3 text-left">
          Amount
        </div>
        <div className="col-auto fs12 color-black-3 text-right">
          Time
        </div>
      </div>
    )
  }
  const ListItem = ({item})=>{
    return (
      <div className="row pt5 pb5">
        <div className="col fs12 color-black-2 text-left">
          0.00118642
        </div>
        <div className="col-auto fs12 color-black-2 text-left">
          10
        </div>
        <div className="col-auto fs12 color-black-2 text-right">
          21:23:55
        </div>
      </div>
    )
  }
  return (
    <div className={className} style={{...style}}>
      <ListHeader/>
      {
        [1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=><ListItem key={index} item={item} />)
      }
    </div>
  )
}

export default ListBlock
