import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Form, Radio, Input, Tabs, Upload, Icon, message, Alert} from 'antd';
import {fromPrivateKey} from 'Loopring/ethereum/account'


class UnlockByPrivateKey extends React.Component {

  state = {
    privateKey: null
  };

  setPrivateKey = (e) => {
    this.setState({privateKey: e.target.value})
  };

  render() {
    const {form, modals, account} = this.props;
    const {privateKey} = this.state;
    function handleSubmit() {
      try {
        const wallet = fromPrivateKey(privateKey);
        this.setState({privateKey: null});
        account.setAccount({...wallet, mnemonic: null});
        modals.hideModal({id: 'wallet/unlock'});
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
                rules: []
              })(
                <Input.TextArea size="large" autosize={{minRows: 3, maxRows: 6}} onChange={this.setPrivateKey.bind(this)}/>
              )}
            </Form.Item>
          </Form>
          <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large"
                  disabled={!this.state.privateKey}>UnLock</Button>
        </div>
      )
  }
}

export default Form.create()(UnlockByPrivateKey)
