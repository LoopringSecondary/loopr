import React, { PropTypes } from 'react';
import UnlockWallet from './UnlockWallet'
import GenerateWallet from './GenerateWallet'
import BackupWallet from './BackupWallet'
import ExportKeystore from './ExportKeystore'
import ModalContainer from '../../../modules/modals/container'
import AccountContainer from '../../../modules/account/container'

function Modals(props){
  return (
    <div>
			<ModalContainer id="wallet/unlock" >
				<AccountContainer>
			  	<UnlockWallet />
			  </AccountContainer>
			</ModalContainer>
			<ModalContainer id="wallet/generate" >
				<AccountContainer>
					<GenerateWallet />
				</AccountContainer>
			</ModalContainer>
			<ModalContainer id="wallet/backup" >
        <AccountContainer>
          <BackupWallet />
        </AccountContainer>
      </ModalContainer>
      <ModalContainer id="wallet/export/keystore" >
			  <ExportKeystore />
			</ModalContainer>
    </div>
  );
}

export default Modals;
