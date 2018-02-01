import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'
import UnlockByMnemonic from './UnlockByMnemonic'
import UnlockByPrivateKey from './UnlockByPrivateKey'

function UnlockWallet({form,modals}) {
  const gotoGenerate = ()=>{
    modals.hideModal({id:'wallet/unlock'})
    modals.showModal({id:'wallet/generate'})
  }
  const footer = (
    <div className="fs14 mt20 pt15 color-grey-900 zb-b-t text-center">
      Don't have a Wallet? Let's 
      <a className="color-blue-600 ml5" onClick={gotoGenerate}>
      generate one !
      </a> 
    </div>
  )
  return (
    <Card title="Unlock Wallet">
        <div title="UnLock Wallet">
          <Tabs defaultActiveKey="metamask" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
            <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">MetaMask</div>} key="metamask">
              <UnlockByMetaMask />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">Keystore</div>} key="keystore">
             <UnlockByKeystore />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">Mnemonic</div>} key="mnemonic">
              <UnlockByMnemonic />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">Private Key</div>} key="privatekey">
             <UnlockByPrivateKey />
            </Tabs.TabPane>
          </Tabs>
          {footer}
        </div>
        <div hidden>
          <Form layout="horizontal"className="d-flex flex-column preference-form">
            <Form.Item label="How would you like to access your wallet" colon={false}>
              {form.getFieldDecorator('way', {
                initialValue:'metamask',
                rules:[]
              })(
                <Radio.Group className="">
                  <Radio className="d-flex align-items-center mb15 w-100" value={'metamask'}>
                    MetaMask <Button type="primary" className="bg-green-600 border-none ml10" size="small" icon="like">Recommended</Button>
                  </Radio>
                  <Radio className="d-flex align-items-center mb15 w-100" value={'keystore'}>
                     Keystore / JSON File  
                  </Radio>
                  <Radio className="d-flex align-items-center mb15 w-100" value={'mnemonic'}>
                    Mnemonic
                  </Radio>
                  <Radio className="d-flex align-items-center mb15 w-100" value={'privatekey'}>
                     Private Key
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {footer}
          </Form> 
        </div>
    </Card>
  )
}

export default Form.create()(UnlockWallet)
