import moment from 'moment'
import {toNumber} from "Loopring/common/formatter";

export function getShortAddress(address) {
  if (typeof address == 'string') {
    return address.slice(0, 4) + '...' + address.slice(-4)
  } else {
    throw new Error('address must be string')
  }
}

export function getFormatTime(seconds, style) {
  style = style || 'YYYY/MM/DD HH:mm:ss';
  return moment(seconds * 1000).format(style);
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

export function getTokenAmount(symbol,amount){
  if(symbol && typeof symbol === 'string'){
    console.error('symbol is required')
  }
  if(amount && typeof amount === 'number'){
    console.error('amount is required')
  }
  const tokenConfig = window.CONFIG.getTokenBySymbol(symbol) || {}
  return (toNumber(amount) / Number('1e' + tokenConfig.digits)).toFixed(tokenConfig.precision)
}
export function getTokenValue(symbol,amount,price){
  if(price && typeof price === 'number'){
    console.error('price is required & must be number')
  }
  const formattedAmount = getTokenAmount(symbol,amount)
  return (formattedAmount * price ).toFixed(2)
}

export default {
  getShortAddress,
  getFormatTime,
  getSeconds,
  getTokenAmount,
  getTokenValue,
}
