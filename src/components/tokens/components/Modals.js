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
import AccountContainer from '../../../modules/account/container'

function Modals(props){
  return (
    <div>
      <ModalContainer id='token/transfer'>
        <EthTxContainer id="transfer">
          <AccountContainer>
            <Transfer />
          </AccountContainer>
        </EthTxContainer>
      </ModalContainer>
      <ModalContainer id='token/transfer/preview'>
        <AccountContainer>
          <TransferPreview />
        </AccountContainer>
      </ModalContainer>
      <ModalContainer id='token/transfer/result'>
        <TransferResult />
      </ModalContainer>
      <ModalContainer id='token/receive'>
        <Receive />
      </ModalContainer>
      <ModalContainer id='token/convert'>
        <EthTxContainer id="convert">
          <AccountContainer>
            <Convert />
          </AccountContainer>
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
