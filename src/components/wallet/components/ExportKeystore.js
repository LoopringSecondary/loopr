import React from 'react';
import {Form,Tabs,Card,Input,Alert,Icon,Button,message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import {connect} from 'dva';
import intl from 'react-intl-universal';

class ExportKeystore extends React.Component {
  state = {
    password:null,
    content:'',
    fileName:'',
    blob:null,
    visible:false,
  };

  togglePassword() {
    this.setState({
      visible: !this.state.visible
    })
  }

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
    const accountPassword = window.WALLET.getPassword();
    if(password && (!accountPassword || accountPassword === password) ){
      const file = window.WALLET.download(password);
      this.setState({
        ...file
      });
    }else{
      message.error(intl.get('wallet.backup.wrong_password'))
    }
  }
   copyToClipboard() {
    const {content} = this.state;
    if(content){
      copy(JSON.stringify(content)) ? message.success(intl.get('token.copy_success')) :  message.error(intl.get('token.copy_failed'))
    }else{
      message.warning(intl.get('wallet.backup.input_password'))
    }
  }

  render() {
    const {account} = this.props;
    const {password,content,fileName,blob,visible} = this.state;

    const visibleIcon = (
      <div className="fs14 pl5 pr5">
        {visible &&
        <i className="fa fa-eye" onClick={this.togglePassword.bind(this)}/>
        }
        {!visible &&
        <i className="fa fa-eye-slash" onClick={this.togglePassword.bind(this)}/>
        }
      </div>
    );

    const tip = (
      <div className="text-left">
        <img hidden src={icon} className="mt25 mb25" style={{width: '100px'}}/>
        <Alert
          description={intl.get('wallet.backup.backup_tip')}
          type="error"
          iconType="exclamation-circle"
          showIcon
          className="mb15"
        />
      </div>
    );
    return (
      <Card title={intl.get('navbar.subs.export')}>
          {!content && <div className="">
          <Input
            type={visible ? 'text':'password'}
            placeholder= {window.WALLET.getPassword() ? intl.get('wallet.backup.enter_wallet_password'):intl.get('wallet.backup.enter_password')}
            size="large"
            addonAfter={visibleIcon}
            onChange={this.handlePasswordChange.bind(this)}
          />
          <Button disabled={!password} size="large" className="d-block w-100 mt25" type="primary" onClick={this.getKeystore.bind(this)}>
            {intl.get('wallet.backup.get_keystore')}
          </Button>
          </div>}
          {content &&
            <Tabs defaultActiveKey="file" tabPosition="" animated={true} className="layout-center layout-col" style={{marginTop:"-15px"}}>
              <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('wallet.backup.file_keystore')}</div>} key="file">
                {tip}
                <a href={blob}
                   download={fileName}
                   className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
                  {intl.get('wallet.backup.download_keystore')}
                </a>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('wallet.backup.text_keystore')}</div>} key="Text">
                {tip}
                <Input.TextArea
                  value={JSON.stringify(content)}
                  size="large"
                  rows={4}
                />
                <Button size="large" type="primary" className="d-block w-100 mt25" onClick={this.copyToClipboard.bind(this)}>
                  {intl.get('wallet.backup.copy_keystore')}
                </Button>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('wallet.backup.qr_keystore')}</div>} key="qrcode">
                {tip}
               <QRCode value={JSON.stringify(content)} size={240}/>
              </Tabs.TabPane>
            </Tabs>
          }
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
