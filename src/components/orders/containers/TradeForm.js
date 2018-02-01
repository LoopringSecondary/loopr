import React from 'react';
import Components from '../components';

function TradeFormContainer(props){
  const {side} = props
  return (
    <Components.TradeForm side={side} />
  )
}

export default TradeFormContainer


