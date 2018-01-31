import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'

function UnlockWallet({form}) {
  const recommended = (
    <Badge style={{fontSize:'6px'}} className="bg-green-600 ml10" size="small" icon="like">
      <Icon type='like' className="mr5" />
      Recommended
    </Badge>
  )
  const footer = (
    <div className="fs14 mt20 pt15 color-grey-900 zb-b-t">
      Don't have a Wallet? Let's <a className="color-blue-600 ml5">generate one</a> !
    </div>
  )
  return (
    <Card title="Unlock Wallet">
        <div title="UnLock Wallet">
          <div className="fs16 pb20 color-grey-700" hidden>How would you like to access your wallet ?</div>
          <Tabs defaultActiveKey="metamask" tabPosition="left" animated={true}>
            <Tabs.TabPane tab={<div style={{marginLeft:'-20px'}} className="fs16 text-left">MetaMask{false && recommended}</div>} key="metamask">
              <UnlockByMetaMask />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'-20px'}} className="fs16 text-left">Keystore</div>} key="keystore">
             <UnlockByKeystore />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'-20px'}} className="fs16 text-left">Mnemonic</div>} key="mnemonic">
              Mnemonic
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div style={{marginLeft:'-20px'}} className="fs16 text-left">Private Key</div>} key="privatekey">
             Private Key
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
