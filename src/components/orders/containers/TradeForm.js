import React from 'react';
import Components from '../components';
import Sockets from '../../../modules/socket/containers'
function TradeFormContainer(props){
  const {side,pair} = props
  return (
      <Sockets.TickersByLoopring pair={pair}>
        <Sockets.TickersByPair pair={pair}>
          <Sockets.Prices>
            <Sockets.Assets>
              <Components.TradeForm side={side} pair={pair} />
            </Sockets.Assets>
          </Sockets.Prices>
        </Sockets.TickersByPair>
      </Sockets.TickersByLoopring>
  )
}

export default TradeFormContainer


