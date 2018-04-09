import React from 'react';
import { Link } from 'dva/router';
import { Card, Button,Icon,Alert, Input, Form } from 'antd';
import AddressUnlockAccount from '../../../modules/account/AddressUnlockAccount'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'
import {isValidEthAddress} from 'Loopring/ethereum/utils'
import {configs} from '../../../common/config/data'

const walletType = "Address"

class DemoAccount extends React.Component {
  state = {
    loading: false,
    browserType: '',
    browserSupported: false
  };

  render() {
    const { modal, account, pageFrom} = this.props
    const selectedAddress = configs.demoAccount
    function validateAddress(address) {
      return isValidEthAddress(address)
    }

    function unlocked() {
      window.WALLET = new AddressUnlockAccount({address: selectedAddress})
      window.WALLET_UNLOCK_TYPE = walletType
      account.setWallet({address:selectedAddress, walletType:walletType})
      modal.hideModal({id: 'wallet/demo'});
      unlockRedirection(pageFrom)
    }
    return (
      <Card title={<div className="fs1">{intl.get('wallet.demo_title')}</div>}>
        <div className="">
          <div className="p15 text-center">
              <Icon type="user" className="fs32 border border-grey-200 p10" style={{borderRadius:'50em'}} />
              <div className="fs14 color-black-2 mt5">
                {selectedAddress}
              </div>
              <div className="fs12 color-black-3 mt5">
                {intl.getHTML('wallet.instruction_demo')}
              </div>
          </div>
          <div>

          </div>

          <Button type="primary" className="d-block w-100 mt10" size="large" onClick={unlocked} >{intl.get('wallet.have_a_try')}</Button>
        </div>
      </Card>
    )
  }
}

export default Form.create()(DemoAccount)
