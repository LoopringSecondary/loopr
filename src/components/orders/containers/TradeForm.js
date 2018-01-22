import React from 'react';
import Components from '../components';

function TradeFormContainer(props){
  const {side} = props
  return (
    <div className="">
      <Components.TradeForm side={side} />
    </div>
  )
}

export default TradeFormContainer


