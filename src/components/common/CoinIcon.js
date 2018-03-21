import React, { PropTypes } from 'react';
import ReactSVG from 'react-svg';
import colors from '../../common/config/tokens_colors.json'
// path="//47.100.16.217:8888/icons/LRC.svg"
// ../../assets/icons/
// const path = `./${symbol}.svg`
// const path = `../assets/icons/${symbol}.svg`
const CoinIcon = (props)=>{
  let {symbol='LRC',size='50',fill='',className="",style={} } = props
  symbol = symbol.toUpperCase()
  const path = `../../../../release/icons/${symbol}.svg`
  if(!fill){
    fill = 'fill-'+ colors[symbol] || ''
  }

  return (
    <ReactSVG
        path={path}
        callback={svg => console.log(svg)}
        className={`${fill} ${className}`}
        style={{width:size}}
    />
  )

}

export default CoinIcon
