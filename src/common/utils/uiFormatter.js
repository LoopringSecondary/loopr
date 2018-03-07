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
  const token = window.CONFIG.getTokenBySymbol(symbol) || {}
  return (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision)
}
export function getTokenBalance(token){
  if(!token.digits || !token.precision){
    const tokenConfig = window.CONFIG.getTokenBySymbol(token.symbol) || {}
    token = {...tokenConfig,...token}
  }
  return (toNumber(token.balance) / Number('1e' + token.digits)).toFixed(token.precision)
}

export function getTokenValue(token){
  if(!token.price){
    console.error('token.price is required')
  }
  const balance = getTokenBalance(token)
  return (balance * token.price).toFixed(2)
}

export default {
  getShortAddress,
  getFormatTime,
  getSeconds,
  getTokenAmount,
  getTokenValue,
}
