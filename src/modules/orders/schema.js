import React from 'react';
import {Icon,Popover} from 'antd';
import {toNumber} from "Loopring/common/formatter";
import {getFormatTime} from "../../common/utils/uiFormatter";

// example
// {
//   cancelledAmountB: "0x0"
//   cancelledAmountS: "0x0"
//   dealtAmountB: "0x0"
//   dealtAmountS: "0x0"
//   originalOrder:
//     address: "0x1661D680C4C19b7Bcc7aA7c4330a4a6c3200244a"
//     amountB: "0x2b5e3af16b1880000"
//     amountS: "0xe6ed27d6668000"
//     buyNoMoreThanAmountB: true
//     hash: "0x048e62bfa2378e303fab8e48b474f6132a51268e2aea8ae2b4cfea6562e34e59"
//     lrcFee: "0xb1a2bc2ec50000"
//     marginSplitPercentage: "0x32"
//     protocol: "0x03E0F73A93993E5101362656Af1162eD80FB54F2"
//     salt: "0x3f445cd"
//     timestamp: 1515997219
//     tokenB: "LRC"
//     tokenS: "WETH"
//     ttl: "0xe10"
//     v: "0x1c"
//     r: "0x0b31f70267047a51d116b9c7c5b6704f5817cc48762855c3d3a7fafc4c7fd9c7"
//     s: "0x376a8411656dc6ea8b222d052e53b042071366d2329a0570bc5ea2819e72c389"
//   status: "ORDER_NEW"
// }

const status = {
  ORDER_NEW: {},
  ORDER_PARTIAL: {},
  ORDER_FINISHED: {},
  ORDER_CANCEL: {},
  ORDER_CUTOFF: {}
}
const schema = [
  {
    title:'Order',
    name:'orderHash',
    formatter:(item)=>item.originalOrder.hash,
  },
  {
    title: 'Time',
    name: 'timestamp',
    formatter: (item) => getFormatTime(toNumber(item.originalOrder.validSince) * 1e3),
  },
  {
    title: 'Status',
    name: 'status',
    formatter: (item) => item.status,
  },
  {
    title: 'Maket',
    name: 'market',
    formatter: (item) => `${item.originalOrder.tokenB}/${item.originalOrder.tokenS}`,
  },
  {
    title: 'Side',
    name: 'side',
  },
  {
    title: 'Amount',
    name: 'amount',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase()
      let token =  side === 'buy' ? window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB) : window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? item.originalOrder.amountB : item.originalOrder.amountS
      const symbol = side === 'buy' ? item.originalOrder.tokenB : item.originalOrder.tokenS
      return (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision) + ' ' + symbol
    }
  },
  {
    title: 'Price',
    name: 'price',
    formatter: (item) => {
      return item.originalOrder.side.toLowerCase() === 'buy' ? Number(item.originalOrder.amountS / item.originalOrder.amountB).toFixed(5) : Number(item.originalOrder.amountB / item.originalOrder.amountS).toFixed(5)
    }
  },
  {
    title: 'Total',
    name: 'total',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase()
      const tokenS = item.originalOrder.tokenS
      const tokenB = item.originalOrder.tokenB
      const amountS = item.originalOrder.amountS
      const amountB = item.originalOrder.amountB
      let token = side ? window.CONFIG.getTokenBySymbol(tokenS): window.CONFIG.getTokenBySymbol(tokenB);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? amountS : amountB
      const symbol = side === 'buy' ? tokenS : tokenB
      return (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision) + ' ' +symbol
    },
  },
  {
    title: <span>LRC Fee <a onClick={()=>{}}><Icon type="question-circle"></Icon></a></span>,
    name: 'lrcFee',
    formatter: (item) => {
      let token = window.CONFIG.getTokenBySymbol('LRC');
      token = token || {digits: 18, precision: 6};
      return (toNumber(item.originalOrder.lrcFee) / Number('1e' + token.digits)).toFixed(token.precision) + ' LRC'
    },
  },
  {
    title: 'Filled',
    name: 'filled',
  },

]
export default schema
