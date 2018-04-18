import React from 'react'
import {Link} from 'dva/router'
import renders from './List/renders'
import CoinIcon from '../../common/CoinIcon'
import {toNumber,toBig} from "Loopring/common/formatter";
import intl from 'react-intl-universal';


function DetailBlock({modal = {}}) {
  const item = modal.item;
  const tokenS = item.originalOrder.tokenS;
  const tokenB = item.originalOrder.tokenB;
  const amountB = item.originalOrder.amountB;
  const amountS = item.originalOrder.amountS;
  const amountLrc = item.originalOrder.lrcFee;
  const fm = window.uiFormatter.TokenFormatter;
  const fmLrc = new fm({symbol: 'LRC'});
  const fmS = new fm({symbol:tokenS});
  const fmB = new fm({symbol:tokenB});
  const tokensConfig = window.CONFIG.getTokenBySymbol(tokenS);
  const tokenbConfig = window.CONFIG.getTokenBySymbol(tokenB);
  const market = window.CONFIG.getMarketBySymbol(tokenS,tokenB);

  const getPrice = () => {

    if (item.originalOrder.side.toLowerCase() === 'buy') {
      return (<div>
        <span className="mr5">{window.uiFormatter.getFormatNum(toBig(amountS).div('1e'+tokensConfig.digits).div(toBig(amountB).div('1e'+tokenbConfig.digits)).toFixed(market.pricePrecision))} </span>
        {tokenS}/{tokenB}
      </div>)
    } else {
      return (<div>
        <span className="mr5">{window.uiFormatter.getFormatNum(toBig(amountB).div('1e'+tokenbConfig.digits).div(toBig(amountS).div('1e'+tokensConfig.digits)).toFixed(market.pricePrecision))} </span>
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
    <div>
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
    </div>
  );
}

export default DetailBlock;
