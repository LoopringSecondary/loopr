import React, { PropTypes } from 'react';
import Transfer from './Transfer'
import TransferPreview from './TransferPreview'
import TransferResult from './TransferResult'
import Receive from './Receive'
import Convert from './Convert'
import AddToken from './AddToken'
import EditToken from './EditToken'
import ModalContainer from '../../../modules/modals/container'
import EthTxContainer from '../../../modules/tokens/models/EthTxContainer'

function Modals(props){
  return (
    <div>
      <ModalContainer id='token/transfer'>
        <EthTxContainer id="transfer">
          <Transfer />
        </EthTxContainer>
      </ModalContainer>
      <ModalContainer id='token/transfer/preview'>
        <TransferPreview />
      </ModalContainer>
      <ModalContainer id='token/transfer/result'>
        <TransferResult />
      </ModalContainer>
      <ModalContainer id='token/receive'>
        <Receive />
      </ModalContainer>
      <ModalContainer id='token/convert'>
        <EthTxContainer id="convert">
          <Convert />
        </EthTxContainer>
      </ModalContainer>
      <ModalContainer id='token/add'>
        <AddToken />
      </ModalContainer>
      <ModalContainer id='token/edit'>
        <EditToken />
      </ModalContainer>
    </div>
  );
}

export default Modals;
