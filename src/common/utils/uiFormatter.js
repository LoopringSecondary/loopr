import moment from 'moment'

export function getShortAddress(address) {
  if (typeof address == 'string') {
    return address.slice(0, 4) + '...' + address.slice(-4)
  } else {
    throw new Error('address must be string')
  }
}

export function getFormatTime(seconds, style) {
  style  = style || 'YYYY/MM/DD HH:mm:ss';
 return moment(seconds * 1000).format(style);
}

export default {
  getShortAddress,
  getFormatTime
}
