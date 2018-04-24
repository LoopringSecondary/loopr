import React from 'react';
import {Card, Form, Tabs} from 'antd';
import BackupKeystore from './BackupKeystore';
import BackupPrivatekey from './BackupPrivatekey';
import BackupMnemonic from './BackupMnemonic'
import intl from 'react-intl-universal';

function BackupWallet({modal,account}) {

  return (
    <Card title={intl.get('wallet.backup.backup_wallet')}>
      <div >
        <Tabs defaultActiveKey="keystore" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('wallet.backup.keystore')}</div>} key="keystore">
            <BackupKeystore modal={modal}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('wallet.backup.mnemonic')}</div>} key="mnemonic">
            <BackupMnemonic modal={modal}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('wallet.backup.privatekey')}</div>} key="privatekey">
            <BackupPrivatekey modal={modal}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  )
}

export default Form.create()(BackupWallet)
