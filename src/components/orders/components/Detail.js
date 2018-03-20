import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Card,ListItem,Avatar,Icon,Button } from 'antd'
import renders from './List/renders'
function DetailBlock({modal={}}) {
  const item = modal.item
  const tokenS = item.originalOrder.tokenS
  const tokenB = item.originalOrder.tokenB
  const amountB = item.originalOrder.amountB
  const amountS = item.originalOrder.amountS
  const amountLrc = item.originalOrder.lrcFee
  const fm = window.uiFormatter.TokenFormatter
  let fmS = new fm({symbol:tokenS})
  let fmB = new fm({symbol:tokenB})
  let fmLrc = new fm({symbol:'LRC'})
  const MetaItem = (props)=>{
    const {label,value} = props
    return (
      <div className="row pt10 pb10 pl0 pr0 zb-b-b">
        <div className="col">
          <div className="fs14 color-grey-600">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  const ArrowDivider = (props)=>{
    return (
      <div className="row no-gutters align-items-center fs12" style={{marginTop:'-20px'}}>
        <div className="col">
          <hr className="w-100 bg-grey-900"/>
        </div>
        <div className="col-auto">
          <Icon type="right" className="color-grey-900" style={{marginLeft:'-8px'}}></Icon>
        </div>
      </div>
    )
  }
  return (
    <Card title="Order Detail">
      <div className="row flex-nowrap zb-b-b pb30 justify-content-center align-items-center">
        <div className="col-auto">
          <div className="text-center">
            <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            <div className="fs12 color-grey-900 text-wrap" style={{maxWidth:'180px'}}>
              {tokenS}
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="text-center">
            <ArrowDivider />
          </div>
        </div>
        <div className="col-auto">
          <div className="text-center">
            <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            <div className="fs12 color-grey-900 text-wrap" style={{maxWidth:'180px'}}>
              {tokenB}
            </div>
          </div>
        </div>
      </div>
      <MetaItem label="Status" value={renders.status(null,item)} />
      <MetaItem label="Sell Amount" value={
        <div>
          <span className="mr5">{fmS.getAmount(amountS)}</span>
          {tokenS}
        </div>
      } />
      <MetaItem label="Buy Amount" value={
        <div>
          <span className="mr5">{fmB.getAmount(amountB)}</span>
          {tokenB}
        </div>
      } />
      <MetaItem label="Price" value={
        <div>
          <span className="mr5">{(amountB/amountS).toFixed(3)} </span>
          {tokenB}/{tokenS}
        </div>
      } />
      <MetaItem label="Lrc Fee" value={
        <div>
          <span className="mr5">{fmLrc.getAmount(amountLrc)}</span>
          {'LRC'}
        </div>
      } />

    </Card>

  );
}

export default DetailBlock;
