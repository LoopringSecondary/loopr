import React from 'react';
import {Button, Card, Form, Input,message} from 'antd';
import Token from 'Loopring/ethereum/token'
import validator from 'Loopring/ethereum/validator';


class AddCustomToken extends React.Component {
  state = {
    address:null,
    name:null,
    symbol:null,
    digits:null
  };

  render() {
    const {form} = this.props;
    const { address, name, symbol, digits} = this.state;

    function handleSubmit() {
      //TODO
      resetForm();
      this.setState({
        address:null,
        name:null,
        symbol:null,
        digits:null})
    }

    function resetForm() {
      form.resetFields()
    }

    return (
      <Card title="Add Custom Token" className="">
        <Form layout="horizontal" className="">
          <Form.Item label="Token Contract Address" colon={false}>
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
          <Form.Item label="Token Name" colon={false}>
            {form.getFieldDecorator('name', {
              initialValue: '',
              rules: []
            })(
              <Input size="large"  disabled/>
            )}
          </Form.Item>
          }
          {symbol &&
          <Form.Item label="Token Symbol" colon={false}>
            {form.getFieldDecorator('symbol', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" disabled/>
            )}
          </Form.Item>
          }
          {digits &&
          <Form.Item label="Token Digits" colon={false}>
            {form.getFieldDecorator('digits', {
              initialValue: '',
              rules: []
            })(
              <Input size="large"  disabled/>
            )}
          </Form.Item>
          }
          <Form.Item className="">
            <div className="row">
              <div className="col">
                <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large"
                        disabled={!(address && name && digits && symbol)}>
                  Confirm && Save
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
      this.setState({address});
      const token = new Token({address});
      await token.complete();
      if(!token.symbol || token.digits===-1){
        message.error('Failed to get token config, maybe the contract address you provided is not a ERC20 token contract address');
        return;
      }
      this.setState({name:token.name,symbol:token.symbol,digits:token.digits})
      form.setFieldsValue({name:token.name,symbol:token.symbol,digits:token.digits})
    }
  }

}


export default Form.create()(AddCustomToken);


