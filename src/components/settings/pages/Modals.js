import React, { PropTypes } from 'react';
import ModalContainer from '../../../modules/modals/container'
import SettingsContainer from '../../../modules/settings/container'
import RelayAdd from '../components/RelayAdd'
import GasFee from '../components/GasFee'
import RelayEdit from '../components/RelayEdit'
import Settings from './Settings'

function Modals(){
  return (
    <div>
      <ModalContainer id='settings/relay/add'>
        <SettingsContainer>
          <RelayAdd />
        </SettingsContainer>
      </ModalContainer>
      <ModalContainer id='settings/relay/edit'>
        <SettingsContainer>
          <RelayEdit />
        </SettingsContainer>
      </ModalContainer>
      <ModalContainer id='settings'>
        <Settings />
      </ModalContainer>
      <ModalContainer id='settings/gasfee' visible={true}>
        <SettingsContainer>
          <GasFee />
        </SettingsContainer>
      </ModalContainer>
    </div>
  );
}

export default Modals;



