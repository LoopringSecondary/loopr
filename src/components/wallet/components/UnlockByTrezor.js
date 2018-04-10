import React from 'react';
import {Button, Form, Icon, Alert, message} from 'antd';
import TrezorUnlockAccount from "../../../modules/account/TrezorUnlockAccount";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

class UnlockByTrezor extends React.Component {

  connectTrezor = () => {
    const {modal, pageFrom} = this.props;
    const path = "m/44'/60'/0'/0";
    window.TrezorConnect.setCurrency('BTC');
    window.TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        window.WALLET = new TrezorUnlockAccount({...result,path});
        window.WALLET_UNLOCK_TYPE = 'Trezor';
        modal.showModal({
          id: 'wallet/determineWallet',
          path,
          setWallet: this.setWallet,
          handlePathChange: this.handlePathChange,
          pageFrom: pageFrom
        })
      } else {
        console.error('Error:', result.error);
      }
    }.bind(this));
  };

  setWallet = (index) => {
    const {account} = this.props;
    account.connectToTrezor({index})
    Notification.open({
      message:intl.get('wallet.unlocked_notification_title'),
      description:intl.get('wallet.unlocked_notification_content'),
      type:'success'
    })
  };

  handlePathChange = (path,callback) => {
    window.TrezorConnect.setCurrency('BTC');
    window.TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        window.WALLET = new TrezorUnlockAccount({...result,path});
        callback()
      } else {
        console.error('Error:', result.error);
      }
    });
  };

  render() {
    return (
      <div className="text-left">
        <Alert
          message={<div className="color-green-600 fs18"><Icon type="like"/> {intl.get('wallet.recommended')}</div>}
          description={<div className="color-green-600">
            <div className="fs14">{intl.getHTML('wallet.instruction_trezor')}</div>
          </div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15"></div>
        <Button type="primary" className="d-block w-100" size="large"
                onClick={this.connectTrezor}>{intl.get('wallet.connect_trezor')}</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByTrezor)
