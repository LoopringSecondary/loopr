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
          message="Dont Lose It!"
          description="It cannot be recovered if you lose it."
          type="error"
          showIcon
          className="mb15 mt15 color-red-600"
        />
        <Alert
          message="Do not share it!!"
          description="It cannot be recovered if you lose it."
          type="error"
          showIcon
          className="mb15 color-red-600"
        />
        <Alert
          message="Make a backup!!!"
          description="Secure it like the millions of dollars it may one day be worth."
          type="error"
          className="mb15 color-red-600"
          showIcon={<Icon type="user" />}
        />
      </div>
    )
    return (
      <Card title="Export Keystore" style={{maxWidth:'100%',width:'800px'}}>
        {tip}
        <div className="pt15">
          <div className="fs14 color-grey-800 mb10">Password</div>
          <Input
            type='password'
            size="large"
          />

          {
            false &&
            <a href={''}
               download={''}
               className="ant-btn ant-btn-disabled ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt25 align-items-center">
               Download Keystore File
            </a>
          }
          {
            true &&
            <Button disabled size="large" className="d-block w-100 mt25" >
              Download Keystore File
            </Button>
          }

        </div>

      </Card>
    )
  }
}


export default Form.create()(ExportKeystore)
