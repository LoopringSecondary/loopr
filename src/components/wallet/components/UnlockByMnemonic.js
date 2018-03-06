import React from 'react';
import {Link} from 'dva/router';
import {Alert, Button, Form, Icon, Input, message, Select,Modal,Radio} from 'antd';
import {wallets} from "../../../common/config/data";
import {isValidateMnemonic} from "Loopring/common/mnemonic"
import {fromMnemonic} from 'Loopring/ethereum/account';
const RadioGroup = Radio.Group;

class UnlockByMnemonic extends React.Component {

  state = {
    dpath: null,
    mnemonic: null,
    isMnemonicValid: false,
    password:null,
    index:0,
    visible:false,
    target:0
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

  showAddresses = () => {
    this.setState({visible:true})
  };

  hideModal = () => {
    this.setState({visible: false})
  };

  onChange = (e) => {
    this.setState({
      target: e.target.value,
    });
  };
  nextPage = ()=>{
    const {index} = this.state;
    this.setState({index:index+5,target:index+5})
  };
  previousPage = () =>{
    const {index} = this.state;
    this.setState({index:index-5,target:index-5})
  };

  unlock= () => {
    try{
      const {modal, account} = this.props;
      const {dpath,mnemonic,password,target} = this.state;
      account.setMnemonic({mnemonic,password,dpath:`${dpath}/${target}`});
      this.setState({
        dpath: null,
        mnemonic: null,
        isMnemonicValid: false,
        password:null,
        index:0,
        visible:false,
        target:0
      });
      modal.hideModal({id: 'wallet/unlock'});
      window.routeActions.gotoPath('portfolio');
    }catch (e){
      message.error(e.message)
    }
  };
  render() {
    const {form} = this.props;
    const {dpath,mnemonic,password,index,isMnemonicValid,target} = this.state;
    const radios = [];
    for(let i=index;i<index+5;i++){
      radios.push(<Radio value={i} key={i} className="mb10 fs16" >{isMnemonicValid && fromMnemonic(mnemonic,`${dpath}/${i}`,password).address}</Radio>)
    }
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
        <Button type="primary" className="d-block w-100" size="large" disabled={!this.state.dpath || !this.state.mnemonic || !this.state.isMnemonicValid} onClick={this.showAddresses}>UnLock</Button>
        <Modal
          title='Choose your wallet address'
          visible={this.state.visible}
          onOk={this.unlock}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <RadioGroup onChange={this.onChange} value={target}>
            {radios}
          </RadioGroup>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            {index >0 && <a onClick={this.previousPage}>前一页
            </a>}
            <a onClick={this.nextPage}>下一页
            </a>
          </div>
        </Modal>
      </div>
    )
  }


}


export default Form.create()(UnlockByMnemonic)
