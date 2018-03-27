import React from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import {Card, ListItem, Avatar, Icon, Button} from 'antd'
import renders from './List/renders'
import CoinIcon from '../../common/CoinIcon'
import {toNumber} from "Loopring/common/formatter";
import intl from 'react-intl-universal';

function DetailBlock({modal = {}}) {
  const item = modal.item;
  const tokenS = item.originalOrder.tokenS
  const tokenB = item.originalOrder.tokenB
  const amountB = item.originalOrder.amountB
  const amountS = item.originalOrder.amountS
  const amountLrc = item.originalOrder.lrcFee
  const fm = window.uiFormatter.TokenFormatter
  let fmS = new fm({symbol: tokenS})
  let fmB = new fm({symbol: tokenB})
  let fmLrc = new fm({symbol: 'LRC'})

  const getPrice = () => {

    if (item.originalOrder.side.toLowerCase() === 'buy') {
      return (<div>
        <span className="mr5">{(amountS / amountB).toFixed(8)} </span>
        {tokenS}/{tokenB}
      </div>)
    } else {
      return (<div>
        <span className="mr5">{(amountB / amountS).toFixed(8)} </span>
        {tokenB}/{tokenS}
      </div>)
    }

  };

 const getFilledPercent = () => {
    let percent = 0;
    if (item.originalOrder.side.toLowerCase() === 'sell') {
      percent = (item.dealtAmountS / item.originalOrder.amountS * 100).toFixed(1)
    } else {
      percent = (item.dealtAmountB / item.originalOrder.amountB * 100).toFixed(1)
    }
    return percent.toString().concat('%')
  };


  const MetaItem = (props) => {
    const {label, value} = props
    return (
      <div className="row pt10 pb10 pl0 pr0 zb-b-b">
        <div className="col">
          <div className="fs14 color-black-2">{label}</div>
        </div>
        <div className="col-8 text-right">
          <div className="fs14 color-black-1 text-wrap">{value}</div>
        </div>
      </div>
    )
  }
  return (
    <Card title={intl.get('orders.order_detail')}>
      <div className="row flex-nowrap zb-b-b pb40 justify-content-center align-items-center">
        <div className="col-auto">
          <div className="text-center position-relative">
            <CoinIcon size="50" symbol={tokenS}/>
            <div  className="fs12 color-grey-900 text-wrap position-absolute mx-auto" style={{left:'0',right:'0'}}>
              {tokenS}
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="text-center ">
            <i className="icon-loopring icon-loopring-arrow-right color-black-1 "></i>
          </div>
        </div>
        <div className="col-auto">
          <div className="text-center position-relative">
            <CoinIcon size="50" symbol={tokenB}/>
            <div className="fs12 color-grey-900 text-wrap position-absolute mx-auto" style={{left:'0',right:'0'}}>
              {tokenB}
            </div>
          </div>
        </div>
      </div>
      <MetaItem label={intl.get('orders.order')} value={item.originalOrder.hash}/>
      <MetaItem label={intl.get('orders.status')} value={renders.status(null, item)}/>
      <MetaItem label={intl.get('orders.sell_amount')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmS.getAmount(amountS))}</span>
          {tokenS}
        </div>
      }/>
      <MetaItem label={intl.get('orders.buy_amount')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmB.getAmount(amountB))}</span>
          {tokenB}
        </div>
      }/>
      <MetaItem label={intl.get('orders.price')} value={
        getPrice()
      }/>
      <MetaItem label={intl.get('orders.LrcFee')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmLrc.getAmount(amountLrc))}</span>
          {'LRC'}
        </div>
      }/>
      <MetaItem label={intl.get('order.margin')} value={
        <div>
          <span className="mr5">{toNumber(item.originalOrder.marginSplitPercentage)}%</span>
        </div>
      }/>
      <MetaItem label={intl.get('orders.filled')} value={
        <div>
          <span className="mr5">{getFilledPercent()}</span>
        </div>
      }/>
      <MetaItem label={intl.get('order.since')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatTime(toNumber(item.originalOrder.validSince)*1e3)}</span>
        </div>
      }/>
      <MetaItem label={intl.get('order.till')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatTime(toNumber(item.originalOrder.validUntil)*1e3)}</span>
        </div>
      }/>


    </Card>

  );
}

export default DetailBlock;
