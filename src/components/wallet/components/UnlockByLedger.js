import React from 'react';
import {Button, Form, Modal, Icon, Alert} from 'antd';
import ledger from 'ledgerco';
import LedgerUnlockAccount from '../../../modules/account/LedgerUnlockAccount'

let dPath = "m/44'/60'/0'"

class UnlockByLedger extends React.Component {

  connect = () => {
    if (window.location.protocol !== 'https:') {
      Modal.error({
        title: 'Error',
        content: "Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS",
      });
      return
    } else {
      const {account, modal} = this.props;
      ledger.comm_u2f.create_async()
        .then(comm => {
          const ledgerConnection = new ledger.eth(comm)
          window.WALLET = new LedgerUnlockAccount({ ledger:ledgerConnection })
          window.WALLET_UNLOCK_TYPE = 'Ledger'
          this.isConnected()
            .then(connected=>{
              if(connected){
                modal.hideModal({id: 'wallet/unlock'});
                // open address selection
              } else {
                Modal.error({
                  title: 'Error',
                  content: "Failed to connect with your Ledger device, you could try as followed. 1、Make sure your Ledger device has connected with your computer and unlocked. 2、Set this to 'yes': settings->Browser support 3、Enter into Ethereum app",
                });
              }
            })
        })
      //account.connectToLedger({dpath: dPath})
      //account.connectToTrezor({address, path});
    }
  }

  isConnected = () => {
    return new Promise((resolve, reject) => {
      window.WALLET.getPathAddress(dPath, 0)
        .then(result=>{
          if(result.error){
            resolve(false)
          } else {
            resolve(true)
          }
        })
        .catch(err=>{
          console.error(err)
          resolve(false)
        })
    })
  }

  getAddressByIndex = (index) => {
    const {account} = this.props;
    window.WALLET.getPathAddress(dPath, 0).then(res=>{
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
    window.WALLET.getPathAddress(dPath, 0).then(res=>{
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

  selectPath = () => {
    window.WALLET.selected({dpath:dPath, index:0})
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
        <Button type="primary" className="d-block w-100" size="large" onClick={this.selectedAddressByIndex}> Address</Button>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.selectPath}> selectPath</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByLedger)
