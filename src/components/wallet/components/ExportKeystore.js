import React from 'react';
import {Form,Tabs,Card,Input,Alert,Icon,Button,message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import {connect} from 'dva';

class ExportKeystore extends React.Component {
  state = {
    password:null,
    content:'',
    fileName:'',
    blob:null
  };

  componentWillMount() {
  }

  handlePasswordChange(e){
    const value = e.target.value;
    this.setState({
     password:value
    })
  }

  getKeystore(){
    const {password} = this.state;
    if(password){
      const file = download('17a907936c30f70cf71a78c8cbacc945e5440264675b4d865cb886d415916b8e',password);
      this.setState({
        ...file
      });
    }
  }
   copyToClipboard() {
    const {content} = this.state;
    if(content){
      copy(JSON.stringify(content)) ? message.success('Copy Successfully') :  message.error("Copy Failed")
    }else{
      message.warning('Please input password first')
    }
  }

  render() {
    const {account} = this.props;
    const {password,content,fileName,blob} = this.state;

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
          {!content && <div className="pt15">
          <Input
            type='password'
            placeholder= {account.password ? "Enter Wallet password":"Enter a password to protect your wallet"}
            size="large"
            onChange={this.handlePasswordChange.bind(this)}
          />
          <Button disabled={!password || (account.password && account.password !== password)} size="large" className="d-block w-100 mt25" type="primary" onClick={this.getKeystore.bind(this)}>
            Get Keystore
          </Button>
          </div>}
          {content && <Tabs defaultActiveKey="file" tabPosition="" animated={true} className="layout-center layout-col mt15">
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">File Keystore</div>} key="file">
              {tip}
              <a href={blob}
                 download={fileName}
                 className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
                 Download Keystore File
              </a>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">Text Keystore</div>} key="Text">
              {tip}
              <Input.TextArea
                value={JSON.stringify(content)}
                size="large"
                rows={4}
                auto={true}
              />
              <Button size="large" type="primary" className="d-block w-100 mt25" onClick={this.copyToClipboard.bind(this)}>
                Copy Keystore
              </Button>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 text-center mb5">Qrcode Keystore</div>} key="qrcode">
              {tip}
             <QRCode value={JSON.stringify(content)} size={240}/>
            </Tabs.TabPane>
          </Tabs>}
      </Card>
    )
  }
}
function mapStateToProps(state) {
  return {
    account: state.account
  };
}

export default Form.create()(connect(mapStateToProps)(ExportKeystore))
