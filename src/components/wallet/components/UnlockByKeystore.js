import React from 'react';
import {Button, Form, Radio, Input, Tabs, Upload, Icon, message, Alert} from 'antd';
import {isKeystorePassRequired} from 'Loopring/common/keystore';

class UnlockByKeyStore extends React.Component {

  state = {
    fileList: [],
    password: '',
    isPasswordRequired: false,
    keyStore: ''
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
      const {account,modal} = this.props;
      account.setKeystore({keyStore, password});
      this.setState({
        fileList: [],
        password: '',
        isPasswordRequired: false,
        keyStore: ''
      });
      modal.hideModal({id: 'wallet/unlock'});
      window.routeActions.gotoPath('portfolio');
    } catch (e) {
      message.error(e.message)
    }
  };
  setPassword = (e) => {
    this.setState({password: e.target.value})
  };

  render() {
    const form = this.props.form;
    const {isPasswordRequired, fileList, password, keyStore} = this.state;
    const uploadProps = {
      action: '',
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
      fileList
    };
    return (
      <div className="">
        <Alert
          message={<div className="color-red-600"><Icon type="exclamation-circle"/> NOT Recommended</div>}
          description={<div className="color-red-600">This is a NOT recommended way to access your wallet.</div>}
          type="error"
          showIcon={false}
          className="mb15"
        />
        <Form layout="horizontal" className="">
          <Form.Item label="Select Your Keystore File" colon={false}>
            {form.getFieldDecorator('keystore', {
              initialValue: '',
              rules: []
            })(
              <Upload {...uploadProps} >
                <Button>
                  <Icon type="upload"/> Select JSON File
                </Button>
              </Upload>
            )}
          </Form.Item>
          {isPasswordRequired && <Form.Item className="" label="password">
            {form.getFieldDecorator('password', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" type="password" onChange={this.setPassword.bind(this)}/>
            )}
          </Form.Item>}
        </Form>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.unlock}
                disabled={keyStore === '' || (isPasswordRequired && password === "")}>UnLock</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByKeyStore)
