import React, { PropTypes } from 'react';
import TradeConfirm from './TradeConfirm'
import PlaceOrderSuccess from './PlaceOrderSuccess'
import PlaceOrderError from './PlaceOrderError'
import ModalContainer from '../../../modules/modals/container'
import Sockets from '../../../modules/socket/containers'

function Modals(props){
  return (
    <div>
     <ModalContainer id="trade/confirm">
       <Sockets.Assets>
         <TradeConfirm />
       </Sockets.Assets>
     </ModalContainer>
     <ModalContainer id="trade/place-order-success">
         <PlaceOrderSuccess />
     </ModalContainer>
     <ModalContainer id="trade/place-order-error">
         <PlaceOrderError />
     </ModalContainer>
    </div>
  );
}

export default Modals;
