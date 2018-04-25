import React, { PropTypes } from 'react';
import Detail from './Detail'
import ModalContainer from '../../../modules/modals/container'
import SettingsContainer from '../../../modules/settings/container'

function Modals(props){
  return (
     <ModalContainer id="trade/detail" width="60%">
       <SettingsContainer>
         <Detail />
       </SettingsContainer>
     </ModalContainer>
  );
}

export default Modals;
