import React from 'react';
import {Link} from 'dva/router';
import {Card, Form, Tabs} from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'
import UnlockByMnemonic from './UnlockByMnemonic'
import UnlockByPrivateKey from './UnlockByPrivateKey'
import UnlockByTrezor from './UnlockByTrezor'
import UnlockByLedger from './UnlockByLedger'
import UnlockByAddress from './UnlockByAddress'
import intl from 'react-intl-universal';

function UnlockWallet({form,modal,account}) {
  let { pageFrom } = modal;
  const gotoGenerate = ()=>{
    modal.hideModal({id:'wallet/unlock'});
    modal.showModal({id:'wallet/generate'})
  };
  const footer = (
    <div className="fs2 mt20 pt20 color-grey-900 zb-b-t text-left">
      {intl.get('wallet.no_wallet')}
      <a className="color-blue-600 ml5" onClick={gotoGenerate}>
        {intl.get('wallet.generate_one')} !
      </a>
    </div>
  );
  return (
    <Card title={<div className="fs1">{intl.get('wallet.unlock_tip')}?</div>}>
        <div className="unlock-wallet-tabs">
          <Tabs defaultActiveKey={!account || account.walletType !== 'Address' ? "address" : "metamask"} tabPosition="left" animated={true}>
            {
              !account || account.walletType !== 'Address' &&
              <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.watch_only')}</div>} key="address">
                <UnlockByAddress modal={modal} account={account} pageFrom={pageFrom}/>
              </Tabs.TabPane>
            }
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.metamask')}</div>} key="metamask">
              <UnlockByMetaMask modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.trezor')}</div>} key="trezor">
              <UnlockByTrezor modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.ledger')}</div>} key="ledger">
              <UnlockByLedger modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.keystore')}</div>} key="keystore">
             <UnlockByKeystore modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.mnemonic')}</div>} key="mnemonic">
              <UnlockByMnemonic modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
            <Tabs.TabPane className="pl10" tab={<div className="fs2 text-left">{intl.get('wallet.privateKey')}</div>} key="privatekey">
             <UnlockByPrivateKey modal={modal} account={account} pageFrom={pageFrom}/>
            </Tabs.TabPane>
          </Tabs>
          {footer}
        </div>
    </Card>
  )
}

export default Form.create()(UnlockWallet)
