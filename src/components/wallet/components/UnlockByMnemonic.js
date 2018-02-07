import React from 'react';
import {Link} from 'dva/router';
import {Alert, Button, Form, Icon, Input, message, Select} from 'antd';
import {wallets} from "../../../common/config/data";
import {isValidateMnemonic} from "Loopring/common/mnemonic"

class UnlockByMnemonic extends React.Component {

  state = {
    dpath: null,
    mnemonic: null,
    isMnemonicValid: false,
    password:null
  };
  handleWalletChange = (e)=>{
    const dpath= wallets[e].dpath;
    this.setState({dpath});
  };

  handlePasswordChange =(e)=>{
    this.setState({password:e.target.value})
  };

  handleMnemonicChange = (e)=>{
    this.setState({mnemonic:e.target.value,isMnemonicValid:isValidateMnemonic(e.target.value)})
  };

  unlock= () => {
    try{
      const {modal, account} = this.props;
      account.setMnemonic({...this.state});
      this.setState({
        dpath: null,
        mnemonic: null,
        password:null
      });
      modal.hideModal({id: 'wallet/unlock'});
      window.routeActions.gotoPath('portfolio');
    }catch (e){
      message.error(e.message)
    }
  };
  render() {
    const {form} = this.props;
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
          <Form.Item className="mb15" label="Select Your Wallet Type">
            {form.getFieldDecorator('wallet', {
              initialValue: '',
              rules: [{
                required:true,
                message:"Please select a kind of wallet"
              }]
            })(
              <Select
                showSearch
                optionFilterProp="children"
                size="large"
                onChange={this.handleWalletChange}
              >
                {wallets.map((item, index) =>
                  <Select.Option key={index} >{item.name}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item className="mb15" label="Paste Your Mnemonic Here">
            {form.getFieldDecorator('mnemonic', {
              initialValue:'',
              rules: [{
                required:true,
                message:"Please input valid phrase",
                validator:(rule, value, cb) => isValidateMnemonic(value) ? cb() : cb(true)
              }]
            })(
              <Input.TextArea size="large" autosize={{minRows: 3, maxRows: 6}} onChange={this.handleMnemonicChange}/>
            )}
          </Form.Item>
          <Form.Item className="mb25" label="Password(optional)">
            {form.getFieldDecorator('password', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" type="password" onChange={this.handlePasswordChange}/>
            )}
          </Form.Item>
        </Form>
        <Button type="primary" className="d-block w-100" size="large" disabled={!this.state.dpath || !this.state.mnemonic || !this.state.isMnemonicValid} onClick={this.unlock}>UnLock</Button>
      </div>
    )
  }


}


export default Form.create()(UnlockByMnemonic)
