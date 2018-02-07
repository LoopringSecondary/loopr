import React from 'react';
import {Button, Card, Form, Input} from 'antd';
import Token from 'Loopring/ethereum/token'
import validator from 'Loopring/ethereum/validator';


class AddCustomToken extends React.Component {
  state = {
    token: null
  };

  render() {
    const {form} = this.props;
    const {token} = this.state;

    function handleSubmit() {

      //TODO
      resetForm();
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
          {token.name &&
          <Form.Item label="Token Name" colon={false}>
            {form.getFieldDecorator('name', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" value={token.name} disabled/>
            )}
          </Form.Item>
          }
          {token.symbol &&
          <Form.Item label="Token Symbol" colon={false}>
            {form.getFieldDecorator('symbol', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" value={token.symbol} disabled/>
            )}
          </Form.Item>
          }
          {token.digits &&
          <Form.Item label="Token Digits" colon={false}>
            {form.getFieldDecorator('digits', {
              initialValue: '',
              rules: []
            })(
              <Input size="large" value={token.digits} disabled/>
            )}
          </Form.Item>
          }
          <Form.Item className="">
            <div className="row">
              <div className="col">
                <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large"
                        disabled={!(token && token.name && token.digits && token.symbol)}>
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
    const address = e.target.value;
    if (this.isValidAddress(address)) {
      const token = new Token({address});
      await token.complete();
      this.setState({token})
    }
  }

}


export default Form.create()(AddCustomToken);


