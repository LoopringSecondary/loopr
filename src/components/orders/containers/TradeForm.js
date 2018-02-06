import React from 'react';
import Components from '../components';

function TradeFormContainer(props){
  const {side,pair} = props
  return (
    <Components.TradeForm side={side} pair={pair} />
  )
}

export default TradeFormContainer


