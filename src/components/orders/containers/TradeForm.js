import React from 'react';
import Components from '../components';
import Sockets from '../../../modules/socket/containers'
import PlaceOrderContainer from '../../../modules/orders/models/PlaceOrderContainer'
import SettingsContainer from '../../../modules/settings/container'
import AccountContainer from '../../../modules/account/container'

function TradeFormContainer(props){
  const {side,pair} = props
  return (
    <Sockets.TickersByLoopring pair={pair}>
      <Sockets.TickersByPair pair={pair}>
        <Sockets.Prices>
          <Sockets.Assets>
            <SettingsContainer>
              <PlaceOrderContainer id="sell">
                <AccountContainer>
                  <Sockets.PendingTxs>
                  <Components.TradeForm side={side} pair={pair} />
                  </Sockets.PendingTxs>
                </AccountContainer>
              </PlaceOrderContainer>
            </SettingsContainer>
          </Sockets.Assets>
        </Sockets.Prices>
      </Sockets.TickersByPair>
    </Sockets.TickersByLoopring>
  )
}

export default TradeFormContainer


