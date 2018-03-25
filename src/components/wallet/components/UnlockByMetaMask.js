import React from 'react';
import { Link } from 'dva/router';
import { Modal, Button,Icon,Alert } from 'antd';
import MetaMaskUnlockAccount from '../../../modules/account/MetaMaskUnlockAccount'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'

const walletType = "MetaMask"

class UnlockByMetaMask extends React.Component {
  state = {
    loading: false
  };

  connectToMetamask = () => {
    const {modal, account, pageFrom} = this.props
    this.setState({loading:true})
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.web3.version.getNetwork((err, netId) => {
        if (netId !== '1') {
          Modal.error({
            title: intl.get('wallet.error_title'),
            content: intl.get('wallet.content_metamask_mainnet'),
          });
          this.setState({loading:false})
          return
        }
        let selectedAccount = window.web3.eth.accounts[0]
        window.WALLET = new MetaMaskUnlockAccount({web3: window.web3, address: selectedAccount})
        window.WALLET_UNLOCK_TYPE = walletType
        account.setWallet({address:selectedAccount, walletType:walletType})
        this.setState({loading:false})
        modal.hideModal({id: 'wallet/unlock'});
        unlockRedirection(pageFrom)
        let alert = false
        var accountInterval = setInterval(function() {
          if ((!window.web3 || !window.web3.eth.accounts[0]) && !alert) {
            alert = true
            console.log("MetaMask account locked:", selectedAccount)
            clearInterval(accountInterval)
            account.deleteAccount({})
            Modal.warning({
              title: intl.get('wallet.warning_title'),
              content: intl.get('wallet.content_metamask_logout'),
            });
            return
          }
          // page will be reload automatically
          window.web3.version.getNetwork((err, netId) => {
            if (netId !== '1' && !alert) {
              alert = true
              clearInterval(accountInterval)
              account.deleteAccount({})
              Modal.error({
                title: intl.get('wallet.error_title'),
                content: intl.get('wallet.content_metamask_unlock_again'),
              });
              return
            }
          })
          if (window.web3.eth.accounts[0] !== selectedAccount) {
            selectedAccount = window.web3.eth.accounts[0];
            Modal.info({
              title: intl.get('wallet.info_title'),
              content: intl.get('wallet.content_metamask_account_change'),
            });
            if(selectedAccount) {
              console.log("MetaMask account changed to:", selectedAccount)
              account.setWallet({address: selectedAccount})
            }
          }
        }, 100);
      })
    } else {
      let content = intl.get('wallet.content_metamask_install')
      if(window.web3 && !window.web3.eth.accounts[0]) { // locked
        content = intl.get('wallet.content_metamask_locked')
      }
      Modal.error({
        title: intl.get('wallet.error_title'),
        content: content,
      });
      this.setState({loading:false})
    }
  }

  render() {
    const {loading} = this.state;
    return (
      <div className="text-left">
        <Alert
          message={<div className="color-green-600 fs18"><Icon type="like"/> {intl.get('wallet.recommended')}</div>}
          description={
            <div className="color-green-600 fs14">
              {intl.getHTML('wallet.instruction_metamask')}
            </div>
          }
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs14 mb10 mt15">
          <Icon type="export" className="mr5 fs14" /><a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">{intl.get('wallet.get_metamask')}</a>
        </div>
        <div className="color-grey-500 fs14 mb10">
          <Icon type="export" className="mr5 fs14" /><a href="https://metamask.io/">{intl.get('wallet.get_metamask_for_others')}</a>
        </div>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connectToMetamask} loading={loading}>{intl.get('wallet.connect_to_metamask')}</Button>
      </div>
    )
  }
}

export default UnlockByMetaMask;
