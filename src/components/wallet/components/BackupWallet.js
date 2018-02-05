import React from 'react';
import {Card, Form, Tabs} from 'antd';
import BackupKeystore from './BackupKeystore';
import BackupPrivatekey from './BackupPrivatekey';
import BackupMnemonic from './BackupMnemonic'

function BackupWallet({form,modals,account}) {

  return (
    <Card title="Backup Wallet">
      <div title="UnLock Wallet">
        <Tabs defaultActiveKey="keystore" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">Keystore</div>} key="keystore">
            <BackupKeystore modals={modals} account={account}/>
          </Tabs.TabPane>
          {account['mnemonic'] &&
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">Mnemonic</div>} key="mnemonic">
            <BackupMnemonic modals={modals} account={account}/>
          </Tabs.TabPane>
          }
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">PrivateKey</div>} key="privatekey">
            <BackupPrivatekey modals={modals} account={account}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  )
}

export default Form.create()(BackupWallet)
