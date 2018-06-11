import React, { PropTypes } from 'react';
import UnlockWallet from './UnlockWallet'
import GenerateWallet from './GenerateWallet'
import BackupWallet from './BackupWallet'
import ExportKeystore from './ExportKeystore'
import ModalContainer from '../../../modules/modals/container'
import AccountContainer from '../../../modules/account/container'
import SelectAccount from './SelectAccount'
import Airdrop from './Airdrop'
import AirdropBind from './AirdropBind'
import DemoAccount from './DemoAccount'
import DetermineWallet from './DetermineWallet'
import WatchOnlyToUnlock from './WatchOnlyToUnlock'
import ClaimTicket from './ClaimTicket'



function Modals(props){
  return (
    <div>
			<ModalContainer id="wallet/unlock" width="60%" >
				<AccountContainer>
			  	<UnlockWallet />
			  </AccountContainer>
			</ModalContainer>
      <ModalContainer id="wallet/selectAccount" >
          <SelectAccount />
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
      <ModalContainer id="wallet/airdrop" >
        <Airdrop />
      </ModalContainer>
      <ModalContainer id="wallet/bind" >
        <AirdropBind />
      </ModalContainer>
      <ModalContainer id="wallet/demo" >
        <AccountContainer>
          <DemoAccount />
        </AccountContainer>
      </ModalContainer>
      <ModalContainer id="wallet/determineWallet"  width="60%">
        <DetermineWallet />
      </ModalContainer>
      <ModalContainer id="wallet/watchOnlyToUnlock" >
        <AccountContainer>
          <WatchOnlyToUnlock />
        </AccountContainer>
      </ModalContainer>
      <ModalContainer id="wallet/claimTicket" >
        <ClaimTicket/>
      </ModalContainer>
    </div>
  );
}

export default Modals;
