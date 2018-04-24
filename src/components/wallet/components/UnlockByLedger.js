import React from 'react';
import {Button, Form, Modal, Icon, Alert} from 'antd';
import ledger from 'ledgerco';
import LedgerUnlockAccount from '../../../modules/account/LedgerUnlockAccount'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

const dpath = "m/44'/60'/0'";
const walletType = "Ledger";

class UnlockByLedger extends React.Component {
  state = {
    loading: false
  };

  connect = () => {
    this.setState({loading:true})
    if (window.location.protocol !== 'https:') {
      Notification.open({
        message:intl.get('wallet.failed_connect_ledger_title'),
        description:intl.get('wallet.content_ledger_unlock_require_https'),
        type:'error'
      })
      this.setState({loading:false})
      return
    }
    const {modal, pageFrom} = this.props;
    ledger.comm_u2f.create_async()
      .then(comm => {
        const ledgerConnection = new ledger.eth(comm)
        window.WALLET = new LedgerUnlockAccount({ ledger:ledgerConnection })
        window.WALLET_UNLOCK_TYPE = walletType
        this.isConnected()
          .then(connected=>{
            this.setState({loading:false})
            if(connected){
              modal.hideModal({id: 'wallet/unlock'});
              modal.showModal({id: 'wallet/determineWallet',path:dpath, walletType,setWallet:this.setWallet,handlePathChange:this.handlePathChange, pageFrom:pageFrom})
            }
          })
      })
  }

  handlePathChange = (path,callback)=>{
    this.isConnected(path).then(() =>{callback();});
  };

  setWallet = (index, address) => {
    const {account} = this.props;
    window.WALLET.setIndex({dpath, index})
    account.setWallet({address:window.WALLET.getAddress(), walletType:walletType})
    Notification.open({
      message:intl.get('wallet.unlocked_notification_title'),
      description:intl.get('wallet.unlocked_notification_content'),
      type:'success'
    })
  };

  isConnected = (path) => {
    if(window.WALLET && window.WALLET_UNLOCK_TYPE === 'Ledger') {
      return new Promise((resolve, reject) => {
        path = path || dpath;
        window.WALLET.getPublicKey(path)
          .then(result=>{
            if(result.error){
              //TODO got `Error: U2F not supported` when in Safari
              Notification.open({
                message:intl.get('wallet.failed_connect_ledger_title'),
                description:intl.get('wallet.content_ledger_connect_failed'),
                type:'error'
              })
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
          case 'Invalid status 6801': content = intl.get('wallet.content_leder_locked'); break;

        }
        Notification.open({
          message:intl.get('wallet.failed_connect_ledger_title'),
          description:content,
          type:'error'
        })
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
          case 'Invalid status 6801': content = intl.get('wallet.content_leder_locked'); break;

        }
        Notification.open({
          message:intl.get('wallet.failed_connect_ledger_title'),
          description:content,
          type:'error'
        })
        return
      }
      account.setWallet({address:res.address})
    })
  }

  render() {
    const {loading} = this.state;
    return (
      <div>
        <Alert
          message={<div className="color-green-600 fs18"><Icon type="like"/> {intl.get('wallet.recommended')}</div>}
          description={<div className="color-green-600"><div className="fs14">{intl.getHTML('wallet.instruction_ledger')}</div></div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15"></div>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connect} loading={loading}> {intl.get('wallet.connect_to_ledger')}</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByLedger)
