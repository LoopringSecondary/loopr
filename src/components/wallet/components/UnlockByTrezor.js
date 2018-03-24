import React from 'react';
import {Button, Form, Icon, Alert} from 'antd';
import TrezorUnlockAccount from "../../../modules/account/TrezorUnlockAccount";
import intl from 'react-intl-universal';

class UnlockByTrezor extends React.Component {

  connectTrezor =  () => {
    const {modal, pageFrom} = this.props;
    const path = "m/44'/60'/0'/0";
    console.log(this.props);
    window.TrezorConnect.setCurrency('BTC');
    window.TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        window.WALLET = new TrezorUnlockAccount(result);
        window.WALLET_UNLOCK_TYPE = 'Trezor';
        modal.showModal({id: 'wallet/selectAccount', setWallet:this.setWallet, pageFrom:pageFrom})
      } else {
        console.error('Error:', result.error);
      }
    }.bind(this));
  };

  setWallet = (index) => {
    const {account} = this.props;
    account.connectToTrezor({index})
  };
  render() {
    return (
      <div className="text-left">
        <Alert
          message={<div className="color-green-600"><Icon type="like" /> {intl.get('wallet.recommended')}</div>}
          description={<div className="color-green-600">{intl.get('wallet.recommend_way')}</div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15"></div>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connectTrezor}>{intl.get('wallet.connect_trezor')}</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByTrezor)
