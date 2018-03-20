import React from 'react';
import { Link } from 'dva/router';
import { Modal, Button,Icon,Alert } from 'antd';
import MetaMaskUnlockAccount from '../../../modules/account/MetaMaskUnlockAccount'

const walletType = "MetaMask"

class UnlockByMetaMask extends React.Component {
  state = {
    loading: false
  };

  connectToMetamask = () => {
    const {modal, account} = this.props
    this.setState({loading:true})
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.web3.version.getNetwork((err, netId) => {
        if (netId !== '1') {
          Modal.error({
            title: 'Error',
            content: "We only support Ethereum mainnet when using MetaMask",
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
        window.routeActions.gotoPath('/wallet/portfolio');

        var accountInterval = setInterval(function() {
          if (!window.web3 || !window.web3.eth.accounts[0]) {
            console.log("MetaMask account locked:", selectedAccount)
            clearInterval(accountInterval)
            account.deleteAccount({})
            Modal.warning({
              title: 'Warning',
              content: 'You have logout from MetaMask',
            });
            return
          }
          // page will be reload automatically
          window.web3.version.getNetwork((err, netId) => {
            if (netId !== '1') {
              clearInterval(accountInterval)
              account.deleteAccount({})
              Modal.error({
                title: 'Error',
                content: "You may have changed your MetaMask network, or your computer has ever been locked. For either reason, you should make sure your MetaMask is using MainNetwork and unlock your wallet again",
              });
              return
            }
          })
          if (window.web3.eth.accounts[0] !== selectedAccount) {
            selectedAccount = window.web3.eth.accounts[0];
            if(selectedAccount) {
              console.log("MetaMask account changed to:", selectedAccount)
              account.setWallet({address: selectedAccount})
            }
          }
        }, 100);
      })
    } else {
      let content = 'Your may need to install MetaMask extension to your browser first'
      if(window.web3 && !window.web3.eth.accounts[0]) { // locked
        content = 'Failed to connect with MetaMask, please unlock and use'
      }
      Modal.error({
        title: 'Error',
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
          message={<div className="color-green-600"><Icon type="like"/> Recommended</div>}
          description={<div className="color-green-600">This is a recommended way to access your wallet.</div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15">
          <a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Get MetaMask chrome extension (for Chrome Firefox Opera)</a>
        </div>
        {false &&
        <div className="color-grey-500 fs12 mb10">
          Download MetaMask For Other Browser
        </div>
        }
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connectToMetamask} loading={loading}>Connect To MetaMask</Button>
      </div>
    )
  }
}

export default UnlockByMetaMask;
