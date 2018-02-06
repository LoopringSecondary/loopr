import React from 'react';
import {Link} from 'dva/router';
import {Alert, Button, Form, Icon, Input, message} from 'antd';
import validator from 'Loopring/common/validator';
class UnlockByPrivateKey extends React.Component {

  state = {
    privateKey: null,
    valid: false
  };

  setPrivateKey = (e) => {
    this.setState({privateKey: e.target.value,valid:this.isValidPrivateKey(e.target.value)})
    console.log(this.state);
  };

  isValidPrivateKey = (key) => {
    try {
      validator.validate({value: key, type: 'PRIVATE_KEY'});
      return true;
    } catch (e) {
      return false;
    }
  };

  render() {
    const {form, modal, account} = this.props;

    function handleSubmit() {
      try {
        account.setPrivateKey({...this.state});
        this.setState({privateKey: null});
        modal.hideModal({id: 'wallet/unlock'});
        window.routeActions.gotoPath('portfolio');
      } catch (e) {
        message.error(e.message)
      }
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
          <Form.Item className="" label="Paste Your PrivateKey Here">
            {form.getFieldDecorator('privatekey', {
              initialValue: '',
              rules: [{
                required: true,
                message: "Please input valid private key",
                validator: (rule, value, cb) => this.isValidPrivateKey(value) ? cb() : cb(true)
              }]
            })(
              <Input.TextArea size="large" autosize={{minRows: 3, maxRows: 6}} onChange={this.setPrivateKey}/>
            )}
          </Form.Item>
        </Form>
        <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large"
                disabled={!this.state.privateKey || !this.state.valid}>UnLock</Button>
      </div>
    )
  }
}

export default Form.create()(UnlockByPrivateKey)
