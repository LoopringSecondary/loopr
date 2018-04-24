import React from 'react';
import {Button, Card, Form, Input, Spin} from 'antd';
import Token from 'Loopring/ethereum/token'
import validator from 'Loopring/ethereum/validator';
import intl from 'react-intl-universal';
import {configs} from '../../../common/config/data'
import Notification from 'Loopr/Notification'

const {tokens} = configs;

class AddCustomToken extends React.Component {

  state = {
    address: null,
    name: null,
    symbol: null,
    digits: null,
    loading: false
  };

  handleSubmit = () => {
    try {
      window.STORAGE.tokens.addCustomToken({...this.state, custom: true});
      this.resetForm();
      this.setState({
        address: null,
        name: null,
        symbol: null,
        digits: null,
        loading: false
      });
      this.props.modal.hideModal({id: 'token/add'});
      Notification.open({message: intl.get('tokens.save_successfully'), type: "success", size: 'small'});
    } catch (e) {
      Notification.open({message: e.message, type: "error", size: 'small'})
    }
  };

  resetForm = () => {
    this.props.form.resetFields()
  };

  render() {
    const {form} = this.props;
    const {address, name, symbol, digits, loading} = this.state;

    return (
      <Card title={intl.get('tokens.add_token')} className="">
          <Form layout="horizontal" className="">
            <Form.Item label={intl.get('tokens.token_address')} colon={false}>
              {form.getFieldDecorator('address', {
                initialValue: '',
                rules: [{
                  required: true, message: intl.get('token.add_custom_token_tip'),
                  validator: (rule, value, cb) => this.isValidAddress(value) ? cb() : cb(true)
                }]
              })(
                <Input size="large" onChange={this.handleChange}/>
              )}
            </Form.Item>
            <Spin spinning={loading}>
            {name &&
            <Form.Item label={intl.get('tokens.token_name')} colon={false}>
              {form.getFieldDecorator('name', {
                initialValue: '',
                rules: []
              })(
                <Input size="large" disabled/>
              )}
            </Form.Item>
            }
            {symbol &&
            <Form.Item label={intl.get('tokens.token_symbol')} colon={false}>
              {form.getFieldDecorator('symbol', {
                initialValue: '',
                rules: []
              })(
                <Input size="large" disabled/>
              )}
            </Form.Item>
            }
            {digits &&
            <Form.Item label={intl.get('tokens.token_digits')} colon={false}>
              {form.getFieldDecorator('digits', {
                initialValue: '',
                rules: []
              })(
                <Input size="large" disabled/>
              )}
            </Form.Item>
            }
            <Form.Item className="">
              <div className="row">
                <div className="col">
                  <Button onClick={this.handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large"
                          disabled={!(address && name && digits && symbol)}>
                    {intl.get('tokens.confirm_save')}
                  </Button>
                </div>
              </div>
            </Form.Item>
            </Spin>
          </Form>
      </Card>
    );
  };

  isValidAddress = (add) => {
    try {
      validator.validate({value: add, type: 'ADDRESS'});
      return true;
    } catch (e) {
      return false;
    }
  };

  handleChange = async (e) => {
    const {form} = this.props;
    const address = e.target.value;
    this.setState({name: null, symbol: null, digits: null});
    if (this.isValidAddress(address)) {
      const result = tokens.find(token => token.address.toUpperCase() === address.toUpperCase())
      if (result) {
        Notification.open({message:intl.get('tokens.supportToken'),type:"warning",size:'small'});
        return
      }
      const customTokens = window.STORAGE.tokens.getCustomTokens();

      const custom_history = customTokens.find(token => token.address.toUpperCase() === address.toUpperCase());
      if (custom_history){
        Notification.open({message:intl.get('tokens.already_add'),type:"warning",size:'small'});
        return
      }
      this.setState({address: address, loading: true});
      const token = new Token({address});
      await token.complete();
      if (!token.symbol || token.digits === -1) {
        Notification.open({message: intl.get('tokens.add_token_failed'), type: 'error'});
        this.setState({loading:false});
      }else {
        this.setState({name: token.name, symbol: token.symbol, digits: token.digits, loading: false});
        form.setFieldsValue({name: token.name, symbol: token.symbol, digits: token.digits, address})
      }
    }
  }

}


export default Form.create()(AddCustomToken);


