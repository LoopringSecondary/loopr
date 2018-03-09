import React from 'react';
import Components from '../components';
import Sockets from '../../../modules/socket/containers'
function TradeFormContainer(props){
  const {side,pair} = props
  return (
    <Sockets.Prices>
      <Sockets.TickersByLoopring>
        <Sockets.TickersByPair>
          <Sockets.Assets>
            <Components.TradeForm side={side} pair={pair} />
          </Sockets.Assets>
        </Sockets.TickersByPair>
      </Sockets.TickersByLoopring>
    </Sockets.Prices>
  )
}

export default TradeFormContainer


