import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Badge,Icon,Alert } from 'antd';
import MetaMaskUnlockAccount from "../../../modules/account/MetaMaskUnlockAccount";
import * as fm from '../../../common/Loopring/common/formatter'

let UnlockByMetaMask = ({
     modal, account
  }) => {
  function connectToMetamask() {
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.WALLET = new MetaMaskUnlockAccount({web3: window.web3, address: window.web3.eth.accounts[0]})
      account.setWallet({address: window.web3.eth.accounts[0]})
      //TODO test
      // const rawTx = {};
      // rawTx.to = '0x7414eA41bd1844f61e8990b209a1Dc301489baa9'
      // rawTx.value = fm.toHex(fm.toBig(1.23).times(1e18))
      // rawTx.data = '0x'
      //window.WALLET.sign(rawTx)

      // const rawTx2 = {};
      // rawTx2.to = '0x4b6ea4f497ae9be093f6fb0b4bda9fe54497a82b'
      // rawTx2.value = fm.toHex(fm.toBig(4.56).times(1e18))
      // rawTx2.data = '0x'
      //window.WALLET.sign(rawTx2)

      modal.hideModal({id: 'wallet/unlock'});
      window.routeActions.gotoPath('portfolio');
    } else {
      console.log('no metamask')
    }
  }

  return (
    <div className="text-left">
      <Alert
        message={<div className="color-green-600"><Icon type="like"/> Recommended</div>}
        description={<div className="color-green-600">This is a recommended way to access your wallet.</div>}
        type="success"
        showIcon={false}
      />
      <div className="color-grey-500 fs12 mb10 mt15">
        Download MetaMask For Chrome
      </div>
      <div className="color-grey-500 fs12 mb10">
        Download MetaMask For Other Browser
      </div>
      <Button type="primary" className="d-block w-100" size="large" onClick={connectToMetamask}>Connect To MetaMask</Button>
    </div>
  )
}

export default UnlockByMetaMask;
