import React from 'react';
import { Link } from 'dva/router';
import { Modal, Button,Icon,Alert, Input, Form } from 'antd';
import AddressUnlockAccount from '../../../modules/account/AddressUnlockAccount'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'
import {isValidEthAddress} from 'Loopring/ethereum/utils'
import Notification from 'Loopr/Notification'

const walletType = "Address"

class UnlockByAddress extends React.Component {
  state = {
    loading: false,
    browserType: '',
    browserSupported: false
  };

  render() {
    const {form, modal, account, pageFrom} = this.props

    function validateAddress(address) {
      return isValidEthAddress(address)
    }

    function unlocked() {
      form.validateFields((err, values) => {
        if (!err) {
          const selectedAddress = form.getFieldValue('address')
          window.WALLET = new AddressUnlockAccount({address: selectedAddress})
          window.WALLET_UNLOCK_TYPE = walletType
          account.setWallet({address:selectedAddress, walletType:walletType})
          modal.hideModal({id: 'wallet/unlock'});
          Notification.open({
            message:intl.get('wallet.unlocked_notification_title'),
            description:intl.get('wallet.unlocked_notification_content'),
            type:'success'
          })
          unlockRedirection(pageFrom)
          if(modal.targetModalData) {
            Notification.open({
              type:'warning',
              message:intl.get('wallet.in_watch_only_mode_title'),
              description:intl.get('wallet.in_watch_only_mode_content')
            });
          }
        }
      })
    }

    return (
      <div className="text-left">
        <Alert
          message={<div className="color-green-600 fs18"><Icon type="like"/> {intl.get('wallet.recommended')}</div>}
          description={
            <div className="color-green-600 fs14">
              {intl.getHTML('wallet.instruction_address')}
            </div>
          }
          type="success"
          showIcon={false}
        />
        <div className="mt15">
          <Form layout="horizontal">
            <Form.Item colon={false}>
              {form.getFieldDecorator('address', {
                rules: [{
                  message: intl.get('wallet.invalid_eth_address'),
                  validator: (rule, value, cb) => validateAddress(value) ? cb() : cb(true)
                }]
              })(
                <Input className="d-block w-100" placeholder={intl.get('wallet.address_input_placeholder')} size="large" />
              )}
            </Form.Item>
          </Form>
        </div>
        <Button type="primary" className="d-block w-100" size="large" onClick={unlocked} >{intl.get('wallet.unlock_by_address')}</Button>
      </div>
    )
  }
}

export default Form.create()(UnlockByAddress)
