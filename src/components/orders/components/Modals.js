import React, { PropTypes } from 'react';
import TradeConfirm from './TradeConfirm'
import PlaceOrderSuccess from './PlaceOrderSuccess'
import ModalContainer from '../../../modules/modals/container'

function Modals(props){
  return (
    <div>
     <ModalContainer id="trade/confirm">
         <TradeConfirm />
     </ModalContainer>
     <ModalContainer id="trade/place-order-success">
         <PlaceOrderSuccess />
     </ModalContainer>
    </div>
  );
}

export default Modals;
