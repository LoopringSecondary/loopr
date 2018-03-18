import React, { PropTypes } from 'react';
import Detail from './Detail'
import ModalContainer from '../../../modules/modals/container'


function Modals(props){
  return (
     <ModalContainer id="trade/detail">
         <Detail />
     </ModalContainer>
  );
}

export default Modals;
