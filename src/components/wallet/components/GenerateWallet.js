import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'

function GenerateWallet({form}) {
  const footer = (
    <div className="fs14 mt20 pt15 color-grey-900 zb-b-t">
      Already have a wallet ? <a className="color-blue-600 ml5">Click to unlock</a> !
    </div>
  )
  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-6">
        <Card title="Generate Wallet">
          
          {footer}
        </Card>
      </div>
    </div>
  )
}

export default Form.create()(GenerateWallet)
