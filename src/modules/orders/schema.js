import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "Loopring/common/formatter";
import {getFormatTime} from "../../common/utils/uiFormatter";
import intl from 'react-intl-universal';

const status = {
  ORDER_NEW: {},
  ORDER_PARTIAL: {},
  ORDER_FINISHED: {},
  ORDER_CANCEL: {},
  ORDER_CUTOFF: {}
}
const schema = [
  {
    title:() => intl.get('orders.order'),
    name:'orderHash',
    formatter:(item)=>item.originalOrder.hash,
  },
  {
    title: () => intl.get('orders.market'),
    name: 'market',
    formatter: (item) => `${item.originalOrder.tokenB}/${item.originalOrder.tokenS}`,
  },
  {
    title: () => intl.get('orders.side'),
    name: 'side',
  },
  {
    title: () => intl.get('orders.amount'),
    name: 'amount',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase();
      let token =  side === 'buy' ? window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB) : window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? item.originalOrder.amountB : item.originalOrder.amountS;
      const symbol = side === 'buy' ? item.originalOrder.tokenB : item.originalOrder.tokenS;
      return window.uiFormatter.getFormatNum(toNumber((toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision))) + ' ' + symbol
    }
  },
  {
    title: () => intl.get('orders.price'),
    name: 'price',
    formatter: (item) => {
      const tokenB = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB);
      const tokenS = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
      const market = window.CONFIG.getMarketBySymbol(item.originalOrder.tokenB,item.originalOrder.tokenS);
      const price =  item.originalOrder.side.toLowerCase() === 'buy' ?
        toBig(item.originalOrder.amountS).div('1e'+tokenS.digits).div(toBig(item.originalOrder.amountB).div('1e'+tokenB.digits)).toFixed(market.pricePrecision) :
        toBig(item.originalOrder.amountB).div('1e'+tokenB.digits).div(toBig(item.originalOrder.amountS).div('1e'+tokenS.digits)).toFixed(market.pricePrecision);
      return window.uiFormatter.getFormatNum(price)
    }
  },
  {
    title: () => intl.get('orders.total'),
    name: 'total',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase();
      const tokenS = item.originalOrder.tokenS;
      const tokenB = item.originalOrder.tokenB;
      const amountS = item.originalOrder.amountS;
      const amountB = item.originalOrder.amountB;
      let token = side === 'buy' ? window.CONFIG.getTokenBySymbol(tokenS): window.CONFIG.getTokenBySymbol(tokenB);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? amountS : amountB;
      const symbol = side === 'buy' ? tokenS : tokenB;
      const total = (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision)
      return  window.uiFormatter.getFormatNum(toNumber(total)) + ' ' +symbol
    },
  },
  {
    title: () => intl.get('orders.LrcFee'),
    name: 'lrcFee',
    formatter: (item) => {
      let token = window.CONFIG.getTokenBySymbol('LRC');
      token = token || {digits: 18, precision: 6};
      const total = (toNumber(item.originalOrder.lrcFee) / Number('1e' + token.digits)).toFixed(token.precision);
      return window.uiFormatter.getFormatNum(toNumber(total))  + ' LRC'
    }
  },
  {
    title: () =>  intl.get('orders.time'),
    name: 'timestamp',
    formatter: (item) => getFormatTime(toNumber(item.originalOrder.validSince) * 1e3),
  },
  {
    title: () => intl.get('orders.filled'),
    name: 'filled',
  },
  {
    title: () => intl.get('orders.status'),
    name: 'status',
    formatter: (item) => item.status,
  },

]
export default schema
