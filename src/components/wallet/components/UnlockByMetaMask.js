import React from 'react';
import { Link } from 'dva/router';
import { Modal, Button,Icon,Alert, Steps } from 'antd';
import MetaMaskUnlockAccount from '../../../modules/account/MetaMaskUnlockAccount'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'
import Notification from 'Loopr/Notification'
import {unlockWithMetaMask} from '../../../components/common/Unlock'

const walletType = "MetaMask"

class UnlockByMetaMask extends React.Component {
  state = {
    loading: false,
    browserType: '',
    browserSupported: false,
    metamaskState:'',
    visible:false
  };

  componentDidMount() {
    var u = navigator.userAgent, app = navigator.appVersion;
    if(u.indexOf('OPR') > -1) {
      this.setState({browserType:'Opera', browserSupported: true})
    } else if (u.indexOf('Chrome') > -1) {
      this.setState({browserType:'Chrome', browserSupported: true})
    } else if(u.indexOf('Firefox') > -1) {
      this.setState({browserType:'Firefox', browserSupported: true})
    } else {
      this.setState({browserType:'Others'})
    }
    let metamaskState = ''
    if(window.web3){
      if(!window.web3.eth.accounts[0]) { // locked
        metamaskState = 'locked'
      }
    } else { // to install
      metamaskState = 'uninstall'
    }
    this.setState({metamaskState: metamaskState})
  }

  connectToMetamask = () => {
    const {modal, account, pageFrom} = this.props
    this.setState({loading:true})
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.web3.version.getNetwork((err, netId) => {
        if (netId !== '1') {
          Notification.open({
            message:intl.get('wallet.failed_connect_metamask_title'),
            description:intl.get('wallet.content_metamask_mainnet'),
            type:'error'
          })
          this.setState({loading:false})
          return
        }
        let selectedAccount = window.web3.eth.accounts[0]
        window.WALLET = new MetaMaskUnlockAccount({web3: window.web3, address: selectedAccount})
        window.WALLET_UNLOCK_TYPE = walletType
        account.setWallet({address:selectedAccount, walletType:walletType})
        this.setState({loading:false})
        modal.hideModal({id: 'wallet/unlock'});
        Notification.open({
          message:intl.get('wallet.unlocked_notification_title'),
          description:intl.get('wallet.unlocked_notification_content'),
          type:'success'
        })
        unlockRedirection(pageFrom)
        if(modal.targetModalData) {
          modal.showModal({...modal.targetModalData})
        }
        let alert = false
        var accountInterval = setInterval(function() {
          if ((!window.web3 || !window.web3.eth.accounts[0]) && !alert) {
            alert = true
            console.log("MetaMask account locked:", selectedAccount)
            clearInterval(accountInterval)
            account.deleteAccount({})
            Notification.open({
              message:intl.get('wallet.title_metamask_logout'),
              description:intl.get('wallet.content_metamask_logout'),
              type:'warning'
            })
            return
          }
          // page will be reload automatically
          window.web3.version.getNetwork((err, netId) => {
            if (netId !== '1' && !alert) {
              alert = true
              clearInterval(accountInterval)
              account.deleteAccount({})
              Notification.open({
                message:intl.get('wallet.failed_connect_metamask_title'),
                description:intl.get('wallet.content_metamask_unlock_again'),
                type:'error'
              })
              return
            }
          })
          if (window.web3.eth.accounts[0] !== selectedAccount) {
            selectedAccount = window.web3.eth.accounts[0];
            Notification.open({
              message:intl.get('wallet.title_metamask_account_change'),
              description:intl.get('wallet.content_metamask_account_change'),
              type:'info'
            })
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
      Notification.open({
        message:intl.get('wallet.failed_connect_metamask_title'),
        description:content,
        type:'error'
      })
      this.setState({loading:false})
    }
  }

  render() {
    const {loading} = this.state;

    const openToRefresh = () => {
      if(this.state.metamaskState === 'uninstall') {
        switch(this.state.browserType) {
          case 'Opera': window.open("https://addons.opera.com/extensions/details/metamask/"); break;
          case 'Chrome': window.open("https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"); break;
          case 'Firefox': window.open("https://addons.mozilla.org/firefox/addon/ether-metamask/"); break;
          default: return
        }
      }
      this.setState({
        visible: true,
      });
    }

    const hideModal = () => {
      this.setState({
        visible: false,
      });
    }

    const refresh = () => {
      if (window.web3 && window.web3.eth.accounts[0]) {
        this.connectToMetamask()
      } else {
        window.STORAGE.wallet.storeUnlockedAddress('MetaMask', '')
        window.location.reload()
      }
    }

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
        <Modal
          title={intl.get('wallet.metamask_unlock_steps_title')}
          visible={this.state.visible}
          maskClosable={false}
          onOk={refresh}
          onCancel={hideModal}
          okText={null}
          cancelText={null}
          footer={null}
        >
          <Steps direction="vertical">
            {this.state.metamaskState === 'uninstall' && <Steps.Step status="process" title={intl.get('wallet.metamask_unlock_step_install_title')} description={intl.get('wallet.metamask_unlock_step_install_content')} />}
            <Steps.Step status="process" title={intl.get('wallet.metamask_unlock_step_unlock_title')} description={intl.get('wallet.metamask_unlock_step_unlock_content')} />
            <Steps.Step status="process" title={intl.get('wallet.metamask_unlock_step_refresh_title')}
              description={
                <div>
                  <div>{intl.get('wallet.metamask_unlock_step_refresh_content')}</div>
                  <Button onClick={refresh} type="primary" className="mt5" loading={this.state.loading}>{intl.get('wallet.metamask_unlock_refresh_button')}</Button>
                </div>
              }
            />
          </Steps>
        </Modal>
        {this.state.browserSupported && this.state.browserType === "Chrome" &&
          <div>
            <div className="color-grey-500 fs14 mb10 mt15">
              <Icon type="export" className="mr5 fs14" /><a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">{intl.get('wallet.get_metamask', {browser: 'Chrome'})}</a>
            </div>
            <div className="color-grey-500 fs14 mb10">
              <Icon type="export" className="mr5 fs14" /><a href="https://metamask.io/" target="_blank">{intl.get('wallet.get_metamask_visit')}</a>
          </div>
          </div>
        }
        {this.state.browserSupported && this.state.browserType === "Firefox" &&
        <div>
          <div className="color-grey-500 fs14 mb10 mt15">
            <Icon type="export" className="mr5 fs14" /><a href="https://addons.mozilla.org/firefox/addon/ether-metamask/" target="_blank">{intl.get('wallet.get_metamask', {browser: 'Firefox'})}</a>
          </div>
          <div className="color-grey-500 fs14 mb10">
            <Icon type="export" className="mr5 fs14" /><a href="https://metamask.io/" target="_blank">{intl.get('wallet.get_metamask_visit')}</a>
          </div>
        </div>
        }
        {this.state.browserSupported && this.state.browserType === "Opera" &&
        <div>
          <div className="color-grey-500 fs14 mb10 mt15">
            <Icon type="export" className="mr5 fs14" /><a href="https://addons.opera.com/extensions/details/metamask/" target="_blank">{intl.get('wallet.get_metamask', {browser: 'Opera'})}</a>
          </div>
          <div className="color-grey-500 fs14 mb10">
            <Icon type="export" className="mr5 fs14" /><a href="https://metamask.io/" target="_blank">{intl.get('wallet.get_metamask_visit')}</a>
          </div>
        </div>
        }
        {!this.state.browserSupported &&
          <div className="color-grey-500 fs14 mb10 mt15">
            <Icon type="export" className="mr5 fs14" /><a href="https://www.google.com/chrome/" target="_blank">{intl.get('wallet.download_chrome')}</a>
          </div>
        }
        {this.state.browserSupported && this.state.metamaskState === 'locked' &&
          <Button type="primary" className="d-block w-100" size="large" onClick={openToRefresh}>{intl.get('wallet.metamask_to_unlock')}</Button>
        }
        {this.state.browserSupported && this.state.metamaskState === 'uninstall' &&
        <Button type="primary" className="d-block w-100" size="large" onClick={openToRefresh}>{intl.get('wallet.metamask_to_install')}</Button>
        }
        {this.state.browserSupported && !this.state.metamaskState &&
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connectToMetamask} loading={loading}>{intl.get('wallet.connect_to_metamask')}</Button>
        }
        {!this.state.browserSupported &&
          <Button type="primary" className="d-block w-100" size="large" disabled>{intl.get('wallet.connect_to_metamask_not_supported_browser')}</Button>
        }
      </div>
    )
  }
}

export default UnlockByMetaMask;
