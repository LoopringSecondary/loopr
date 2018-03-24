import React, { PropTypes } from 'react';
import colors from '../../common/config/tokens_colors.json'
const CoinIcon = (props)=>{
  let {symbol='LRC',size='50',color='',className="",style={} } = props
  symbol = symbol.toUpperCase()
  if(!color){
    // color = 'color-'+ colors[symbol] || ''
    color = 'color-grey-900'
  }else{
    color = 'color-'+ color
  }
  return (
    <i className={`icon icon-loopring icon-loopring-${symbol} fs${size} ${color} ${className}`} ></i>
  )
}
export default CoinIcon
