import React from 'react';
import { Link } from 'dva/router';
import { Card, Button,Icon,Alert, Input, Form } from 'antd';
import intl from 'react-intl-universal';
import {isValidEthAddress} from 'Loopring/ethereum/utils'
import {configs} from '../../../common/config/data'

class WatchOnlyToUnlock extends React.Component {
  state = {
    loading: false,
    browserType: '',
    browserSupported: false
  };

  render() {
    const { modal,account} = this.props
    const demoAddress = configs.demoAccount

    const toUnlock = (payload) => {
      modal.hideModal({id: 'wallet/watchOnlyToUnlock'});
      modal.showModal({id:'wallet/unlock', targetModalData: payload})
    }

    const cancel = () => {
      modal.hideModal({id: 'wallet/watchOnlyToUnlock'});
    }

    return (
      <Card title={<div className="fs1">{intl.get('wallet.in_watch_only_mode_title')}</div>}>
        <div className="text-left">
          <div className="fs14 color-black-2 mt5 text-left">
            <div className="row justify-content-center">
              <div style={{lineHeight:'2em',}}>
                <div>{demoAddress === account.address ? intl.get('wallet.in_demo_account_mode_content') : intl.get('wallet.in_watch_only_mode_content')}</div>
                <div className="row justify-content-center mt10">
                  <Button className="alert-btn mr5" size="large" onClick={cancel} >{intl.get('wallet.continue_watch')}</Button>
                  <Button type="primary" className="alert-btn mr5" size="large" onClick={toUnlock.bind(this, modal.originalData)} >{intl.get('wallet.to_unlock')}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default Form.create()(WatchOnlyToUnlock)
