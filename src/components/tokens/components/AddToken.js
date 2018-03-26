import React from 'react';
import {Button, Card, Form, Input, message} from 'antd';
import Token from 'Loopring/ethereum/token'
import validator from 'Loopring/ethereum/validator';
import intl from 'react-intl-universal';
import {configs} from '../../../common/config/data'

const {tokens} = configs;

class AddCustomToken extends React.Component {

  state = {
    address: null,
    name: null,
    symbol: null,
    digits: null
  };

  handleSubmit = () => {
    try {
      window.STORAGE.tokens.addCustomToken({...this.state,custom:true});
      this.resetForm();
      this.setState({
        address: null,
        name: null,
        symbol: null,
        digits: null
      });
      this.props.modal.hideModal({id: 'token/add'});
      message.success(intl.get('tokens.save_successfully'));
    } catch (e) {
      message.error(e.message)
    }
  };

  resetForm = () => {
    this.props.form.resetFields()
  };

  render() {
    const {form} = this.props;
    const {address, name, symbol, digits} = this.state;

    return (
      <Card title={intl.get('tokens.add_token')} className="">
        <Form layout="horizontal" className="">
          <Form.Item label={intl.get('tokens.token_address')} colon={false}>
            {form.getFieldDecorator('address', {
              initialValue: '',
              rules: [{
                required: true, message: "Please input valid address",
                validator: (rule, value, cb) => this.isValidAddress(value) ? cb() : cb(true)
              }]
            })(
              <Input size="large" onChange={this.handleChange}/>
            )}
          </Form.Item>
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
    if (this.isValidAddress(address)) {
      const result = tokens.find(token => token.address.toUpperCase() === address.toUpperCase())
      // if (result) {
      //   message.warning(intl.get('tokens.supportToken'));
      //   return
      // }
      const customTokens = window.STORAGE.tokens.getCustomTokens();

      const custom_history = customTokens.find(token => token.address.toUpperCase() === address.toUpperCase())
      if (custom_history){
        message.warning(intl.get('tokens.already_add'));
        return
      }
      this.setState({address});
      const token = new Token({address});
      await token.complete();
      if (!token.symbol || token.digits === -1) {
        message.error(intl.get('tokens.add_token_failed'));
        return;
      }
      this.setState({name: token.name, symbol: token.symbol, digits: token.digits})
      form.setFieldsValue({name: token.name, symbol: token.symbol, digits: token.digits})
    }
  }

}


export default Form.create()(AddCustomToken);


