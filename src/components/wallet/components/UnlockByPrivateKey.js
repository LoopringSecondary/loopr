import React from 'react';
import {Link} from 'dva/router';
import {Alert, Button, Form, Icon, Input, message} from 'antd';
import validator from 'Loopring/common/validator';
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'

class UnlockByPrivateKey extends React.Component {

  state = {
    privateKey: null,
    valid: false
  };

  setPrivateKey = (e) => {
    this.setState({privateKey: e.target.value, valid: this.isValidPrivateKey(e.target.value)})
  };

  isValidPrivateKey = (key) => {
    try {
      validator.validate({value: key, type: 'PRIVATE_KEY'});
      return true;
    } catch (e) {
      return false;
    }
  };

  bindEnter = (e) => {
    if (e.keyCode === 13) {
      try{
        e.preventDefault();
        const {form,modal, account, pageFrom} = this.props;
        const privateKey = form.getFieldValue('privatekey');
        validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
        account.setPrivateKey({privateKey});
        this.setState({privateKey: null});
        modal.hideModal({id: 'wallet/unlock'});
        unlockRedirection(pageFrom)
      }catch (e){
        message.error(e.message)
      }
    }
  };

  render() {
    const {form, modal, account, pageFrom} = this.props;

    function handleSubmit() {
      try {
        account.setPrivateKey({...this.state});
        this.setState({privateKey: null});
        modal.hideModal({id: 'wallet/unlock'});
        unlockRedirection(pageFrom)
      } catch (e) {
        message.error(e.message)
      }
    }

    return (
      <div className="">
        <Alert
          message={<div className="color-red-600"><Icon type="exclamation-circle"/> {intl.get('wallet.not_recommended')}
          </div>}
          description={<div className="color-red-600">{intl.get('wallet.not_recommended_tip')}</div>}
          type="error"
          showIcon={false}
          className="mb15"
        />
        <Form layout="horizontal" className="">
          <Form.Item className="" label={intl.get('wallet.paste_privatekey')}>
            {form.getFieldDecorator('privatekey', {
              initialValue: '',
              rules: [{
                required: true,
                message: intl.get('wallet.invalid_privateKey'),
                validator: (rule, value, cb) => this.isValidPrivateKey(value) ? cb() : cb(true)
              }]
            })(
              <Input.TextArea size="large" autosize={{minRows: 3, maxRows: 6}} onChange={this.setPrivateKey} onKeyDown={this.bindEnter}/>
            )}
          </Form.Item>
        </Form>
        <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large"
                disabled={!this.state.privateKey || !this.state.valid}>{intl.get('wallet.unlock')}</Button>
      </div>
    )
  }
}

export default Form.create()(UnlockByPrivateKey)
