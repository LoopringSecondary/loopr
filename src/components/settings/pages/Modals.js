import React, { PropTypes } from 'react';
import ModalContainer from '../../../modules/modals/container'
import RelayAdd from '../components/RelayAdd'
import RelayEdit from '../components/RelayEdit'
import Settings from './Settings'

function Modals(){
  return (
    <div>
      <ModalContainer id='settings/relay/add'>
        <RelayAdd />
      </ModalContainer>
      <ModalContainer id='settings/relay/edit'>
        <RelayEdit />
      </ModalContainer>
      <ModalContainer id='settings'>
        <Settings />
      </ModalContainer>
    </div>
  );
}

export default Modals;



