import React from 'react';
import {Button, Form, Modal, Icon, Alert} from 'antd';
import ledger from 'ledgerco';
import LedgerUnlockAccount from '../../../modules/account/LedgerUnlockAccount'
import intl from 'react-intl-universal';

const dpath = "m/44'/60'/0'"
const walletType = "Ledger"

class UnlockByLedger extends React.Component {
  state = {
    loading: false
  };

  connect = () => {
    this.setState({loading:true})
    if (window.location.protocol !== 'https:') {
      Modal.error({
        title: intl.get('wallet.error_title'),
        content: intl.get('wallet.content_ledger_unlock_require_https'),
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
            this.setState({loading:false})
            if(connected){
              modal.hideModal({id: 'wallet/unlock'});
              modal.showModal({id: 'wallet/selectAccount', setWallet:this.setWallet})
            }
          })
      })
  }

  setWallet = (index, address) => {
    const {account} = this.props;
    window.WALLET.setIndex({dpath, index})
    account.setWallet({address:window.WALLET.getAddress(), walletType:walletType})
  };

  isConnected = () => {
    if(window.WALLET && window.WALLET_UNLOCK_TYPE === 'Ledger') {
      return new Promise((resolve, reject) => {
        window.WALLET.getPublicKey(dpath)
          .then(result=>{
            if(result.error){
              //TODO got `Error: U2F not supported` when in Safari
              Modal.error({
                title: intl.get('wallet.error_title'),
                content: intl.get('wallet.content_ledger_connect_failed'),
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
          case 'Invalid status 6801': content = intl.get('wallet.content_leder_locked'); break;

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
          case 'Invalid status 6801': content = intl.get('wallet.content_leder_locked'); break;

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
    const {loading} = this.state;
    return (
      <div>
        <Alert
          message={<div className="color-green-600"><Icon type="like"/> {intl.get('wallet.recommended')}</div>}
          description={<div className="color-green-600">{intl.get('wallet.recommend_way')}</div>}
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
