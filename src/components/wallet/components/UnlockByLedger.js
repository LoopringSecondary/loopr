import React from 'react';
import {Button, Form, Modal, Icon, Alert} from 'antd';
import ledger from 'ledgerco';
import LedgerUnlockAccount from '../../../modules/account/LedgerUnlockAccount'

const dpath = "m/44'/60'/0'"
const walletType = "Ledger"

class UnlockByLedger extends React.Component {

  connect = () => {
    if (window.location.protocol !== 'https:') {
      Modal.error({
        title: 'Error',
        content: "Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS",
      });
      return
    }
    const {account, modal} = this.props;
    ledger.comm_u2f.create_async()
      .then(comm => {
        const ledgerConnection = new ledger.eth(comm)
        window.WALLET = new LedgerUnlockAccount({ ledger:ledgerConnection })
        window.WALLET_UNLOCK_TYPE = walletType
        this.isConnected()
          .then(connected=>{
            if(connected){
              modal.hideModal({id: 'wallet/unlock'});
              modal.showModal({id: 'wallet/selectAccount', setWallet:this.setWallet})
            }
          })
      })
  }

  setWallet = (index, address) => {
    const {account} = this.props;
    window.WALLET.setIndex({dpath, index, address})
      .then(result=>{
        if(result.address) {
          account.setWallet({address:result.address, walletType:walletType})
        }
      })
  };

  isConnected = () => {
    if(window.WALLET && window.WALLET_UNLOCK_TYPE === 'Ledger') {
      return new Promise((resolve, reject) => {
        window.WALLET.getPublicKey(dpath)
          .then(result=>{
            if(result.error){
              //TODO got `Error: U2F not supported` when in Safari
              let content = "Failed to connect with your Ledger device, you could follow these advices and have a try later. 1、Make sure your Ledger device has connected with your computer and unlocked. 2、Set this to 'yes': Settings->Browser support 3、Enter into Ethereum app"
              Modal.error({
                title: 'Error',
                content: content,
              });
              resolve(false)
            } else {
              window.WALLET.setPublicKey(result)
              resolve(true)
            }
          })
      })
    } else {
      return new Promise((resolve, reject) => {resolve(false)})
    }
  }

  getAddressByIndex = (index) => {
    const {account} = this.props;
    window.WALLET.getPathAddress(dpath, 0).then(res=>{
      if(res.error){
        let content = ''
        switch(res.error){
          case 'Invalid status 6801': content = "Your Ledger seems to be locked"; break;

        }
        Modal.error({
          title: 'Error',
          content: content,
        });
        return
      }
    })
  }

  selectedAddressByIndex = (index) => {
    const {account} = this.props;
    window.WALLET.getPathAddress(dpath, 0).then(res=>{
      if(res.error){
        let content = ''
        switch(res.error){
          case 'Invalid status 6801': content = "Your Ledger seems to be locked"; break;

        }
        Modal.error({
          title: 'Error',
          content: content,
        });
        return
      }
      account.setWallet({address:res.address})
    })
  }

  render() {
    return (
      <div>
        <Alert
          message={<div className="color-green-600"><Icon type="like"/> Recommended</div>}
          description={<div className="color-green-600">This is a recommended way to access your wallet.</div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15"></div>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connect}> Connect to Ledger</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByLedger)
