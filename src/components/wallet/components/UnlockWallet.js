import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'

function UnlockWallet({form}) {
  const recommended = (
    <Badge style={{fontSize:'6px'}} className="bg-green-600" size="small" icon="like">
      <Icon type='like' className="mr5" />
      Recommended
    </Badge>
  )
  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-7">
        <Card title="Unlock Wallet">
          <Tabs defaultActiveKey="metamask" tabPosition="left" animated={true}>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">MetaMask{false && recommended}</div>} key="metamask">
              <UnlockByMetaMask />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Keystore / JSON File</div>} key="keystore">
             <UnlockByKeystore />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Mnemonic</div>} key="mnemonic">
              Mnemonic
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Private Key</div>} key="privatekey">
             Private Key
            </Tabs.TabPane>
          </Tabs>
        </Card>
        <div className="mb15"></div>
        <Card title="Unlock Wallet">
          <Form layout="horizontal"className="d-flex flex-column preference-form">
            <Form.Item label="How would you like to access your wallet" colon={false}>
              {form.getFieldDecorator('way', {
                initialValue:'metamask',
                rules:[]
              })(
                <Radio.Group className="">
                  <Radio className="d-flex align-items-center mb15 w-100" value={'metamask'}>
                    MetaMask <Button type="primary" className="bg-green-600 border-none" size="small" icon="like">Recommended</Button>
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
          </Form> 
        </Card>
      </div>
    </div>
  )
}

export default Form.create()(UnlockWallet)
