import moment from 'moment'
import {toNumber,toBig} from "Loopring/common/formatter";
import TokenFormatter from './tokenFormatter'
import {getPrice} from './tokenFormatter'
import intl from 'react-intl-universal';

export function getShortAddress(address) {
  if (typeof address === 'string') {
    return address.slice(0, 8) + '...' + address.slice(-6)
  } else {
    throw new Error('address must be string')
  }
}

export function getFormatTime(seconds, style) {
  style = style || "LLL";
  return moment(toNumber(seconds)).format(style);
}

export function getSeconds(value, unit) {
  value = Number(value);
  switch(unit){
    case 'second':
      return value;
    case 'minute':
      return value * 60;
    case 'hour':
      return value * 3600;
    case 'day':
      return value * 3600 *24;
    default:
      return value;
  }
}

export function getFormatNum(number) {
  number = toBig(number).toString(10).split('.');
  let a = number[0];
  let b = number[1];
  a = intl.get('global.amount',{amount:toNumber(a)});
  const symbol = window.locale && window.locale.startsWith('fr') ? ',' : '.';
  return b ? a.concat(symbol).concat(b) : a
}


export default {
  getShortAddress,
  getFormatTime,
  getSeconds,
  TokenFormatter,
  getPrice,
  getFormatNum
}
