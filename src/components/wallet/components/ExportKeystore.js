import React from 'react';
import {Form,Tabs,Card,Input,Alert,Icon,Button} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"

class ExportKeystore extends React.Component {
  state = {
  }
  componentWillMount() {
  }

  render() {
    const tip = (
      <div className="text-left">
        <img hidden src={icon} className="mt25 mb25" style={{width: '100px'}}/>
        <Alert
          message="Dont Lose It !"
          description="It cannot be recovered if you lose it."
          type="error"
          iconType="exclamation-circle"
          showIcon
          className="mb15 mt15"
        />
        <Alert
          message="Do Not Share It !!"
          description="It cannot be recovered if you lose it."
          type="error"
          iconType="exclamation-circle"
          showIcon
          className="mb15"
        />
        <Alert
          message="Make A Backup !!!"
          description="Secure it like the millions of dollars it may one day be worth."
          type="error"
          iconType="exclamation-circle"
          showIcon
          className="mb15"
        />
      </div>
    )
    return (
      <Card title="Export Keystore">

        <div className="pt15">
          <Input
            type='password'
            placeholder="Enter Wallet password"
            size="large"
          />
          <Button disabled size="large" className="d-block w-100 mt25" >
            Get Keystore
          </Button>

          <Tabs defaultActiveKey="file" tabPosition="" animated={true} className="layout-center layout-col mt15">
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">File Keystore</div>} key="file">
              {tip}
              <a href={''}
                 download={''}
                 className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
                 Download Keystore File
              </a>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">Text Keystore</div>} key="Text">
              {tip}
              <Input.TextArea
                value=""
                size="large"
                rows={4}
                auto={true}
              />
              <Button size="large" type="primary" className="d-block w-100 mt25" >
                Copy Keystore
              </Button>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">Qrcode Keystore</div>} key="qrcode">
              {tip}
              QRCode
            </Tabs.TabPane>
          </Tabs>
        </div>

      </Card>
    )
  }
}


export default Form.create()(ExportKeystore)
