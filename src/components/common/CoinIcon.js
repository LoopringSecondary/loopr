import React, { PropTypes } from 'react';
import ReactSVG from 'react-svg';
import colors from '../../common/config/tokens_colors.json'
// path="//47.100.16.217:8888/icons/LRC.svg"
// ../../assets/icons/
// const path = `./${symbol}.svg`
// const path = `../assets/icons/${symbol}.svg`
const CoinIcon = (props)=>{
  let {symbol='LRC',size='50',fill='',color,className="",style={} } = props
  symbol = symbol.toUpperCase()
  // const path = `../../../../release/icons/${symbol}.svg`
  const path = `../../assets/icons/${symbol}.svg`
  if(!color){
    color = 'color-'+ colors[symbol] || ''
  }

  return (
    <i className={`icon iconfont icon-${symbol} fs${size} ${color}`} ></i>
  )

}

export default CoinIcon
