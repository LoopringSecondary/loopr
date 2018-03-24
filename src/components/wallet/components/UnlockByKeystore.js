import React from 'react';
import {Button, Form, Radio, Input, Tabs, Upload, Icon, message, Alert} from 'antd';
import {isKeystorePassRequired} from 'Loopring/common/keystore';
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'

class UnlockByKeyStore extends React.Component {

  state = {
    fileList: [],
    password: '',
    isPasswordRequired: false,
    keyStore: '',
    loading: false
  };

  handleRemove = (file) => {
    this.setState(({fileList}) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };
  beforeUpload = (file) => {
    console.log("before upload");
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const keyStore = fileReader.result;
      const isPasswordRequired = isKeystorePassRequired(keyStore);
      this.setState({keyStore, isPasswordRequired})
    };
    fileReader.readAsText(file, "utf-8");
    this.setState({fileList: [file]});
    return false;
  };
  unlock = () => {
    try {
      const {keyStore, password} = this.state;
      const {account, modal, pageFrom} = this.props;
      this.setState({
        loading: true
      }, function () {
        account.setKeystore({keyStore, password,cb:(e)=>{
          if(e){
            message.error(e.message)
            this.setState({
              loading: false
            })
          }else{
            modal.hideModal({id: 'wallet/unlock'});
            unlockRedirection(pageFrom)
            this.setState({
              fileList: [],
              password: '',
              isPasswordRequired: false,
              keyStore: '',
              loading: false
            });
          }
        }});
      });
    } catch (e) {
      message.error(e.message)
    }
  };

  setPassword = (e) => {
    this.setState({password: e.target.value})
  };

  render() {
    const form = this.props.form;
    const {isPasswordRequired, fileList, password, keyStore, loading} = this.state;
    const uploadProps = {
      action: '',
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
      fileList
    };
    return (
      <div className="">
        <Alert
          message={<div className="color-red-600"><Icon type="exclamation-circle"/>{intl.get('wallet.not_recommended')}</div>}
          description={<div className="color-red-600">{intl.get('wallet.not_recommended_tip')}</div>}
          type="error"
          showIcon={false}
          className="mb15"
        />
        <Form layout="horizontal" className="">
          <Form.Item label={intl.get('wallet.select_keystore')} colon={false}>
            {form.getFieldDecorator('keystore', {
              initialValue: '',
              rules: []
            })(
              <Upload {...uploadProps} >
                <Button>
                  <Icon type="upload"/> {intl.get('wallet.select_json')}
                </Button>
              </Upload>
            )}
          </Form.Item>
          {isPasswordRequired && <Form.Item className="" label={intl.get('wallet.password')}>
            {form.getFieldDecorator('password', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" type="password" onChange={this.setPassword.bind(this)}/>
            )}
          </Form.Item>}
        </Form>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.unlock}
                loading={loading}
                disabled={keyStore === '' || (isPasswordRequired && password === "")}>{intl.get('wallet.unlock')}</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByKeyStore)
