import React, { PropTypes } from 'react';
import TradeConfirm from './TradeConfirm'
import TradeSteps from './TradeSteps'
import ModalContainer from '../../../modules/modals/container'

function Modals(props){
  return (
    <div>
     <ModalContainer id="trade/confirm">
         <TradeConfirm />
     </ModalContainer>
     <ModalContainer id="trade/steps">
         <TradeSteps />
     </ModalContainer>
    </div>
  );
}

export default Modals;
