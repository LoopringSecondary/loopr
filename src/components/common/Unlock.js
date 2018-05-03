import intl from 'react-intl-universal';
import MetaMaskUnlockAccount from '../../modules/account/MetaMaskUnlockAccount'
import Notification from 'Loopr/Notification'

export function unlockWithMetaMask(web3){
  // account.setWallet has done
  const walletType = "MetaMask"
  let selectedAccount = web3.eth.accounts[0]
  window.WALLET = new MetaMaskUnlockAccount({web3: web3, address: selectedAccount})
  window.WALLET_UNLOCK_TYPE = walletType
  web3.version.getNetwork((err, netId) => {
    if (netId !== '1') {
      Notification.open({
        message:intl.get('wallet.failed_connect_metamask_title'),
        description:intl.get('wallet.content_metamask_mainnet'),
        type:'error'
      })
      this.setState({loading:false})
      return
    }
    Notification.open({
      message:intl.get('wallet.unlocked_notification_title'),
      description:intl.get('wallet.unlocked_notification_content'),
      type:'success'
    })
    let alert = false
    var accountInterval = setInterval(function() {
      if ((!web3 || !web3.eth.accounts[0]) && window.STORE && !alert) {
        alert = true
        console.log("MetaMask account locked:", selectedAccount)
        clearInterval(accountInterval)
        window.STORE.dispatch({
          type:'account/deleteAccount',
          payload:{}
        })
        Notification.open({
          message:intl.get('wallet.title_metamask_logout'),
          description:intl.get('wallet.content_metamask_logout'),
          type:'warning'
        })
        return
      }
      // page will be reload automatically
      web3.version.getNetwork((err, netId) => {
        if (netId !== '1' && window.STORE && !alert) {
          alert = true
          clearInterval(accountInterval)
          window.STORE.dispatch({
            type:'account/deleteAccount',
            payload:{}
          })
          Notification.open({
            message:intl.get('wallet.failed_connect_metamask_title'),
            description:intl.get('wallet.content_metamask_unlock_again'),
            type:'error'
          })
          return
        }
      })
      if (web3.eth.accounts[0] !== selectedAccount) {
        selectedAccount = web3.eth.accounts[0];
        Notification.open({
          message:intl.get('wallet.title_metamask_account_change'),
          description:intl.get('wallet.content_metamask_account_change'),
          type:'info'
        })
        if(selectedAccount && window.STORE) {
          console.log("MetaMask account changed to:", selectedAccount)
          window.STORE.dispatch({
            type:'account/setWallet',
            payload:{address: selectedAccount, walletType:walletType}
          })
        }
      }
    }, 100);
  })
}

