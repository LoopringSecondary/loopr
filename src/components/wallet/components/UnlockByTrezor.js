import React from 'react';
import {Alert, Button, Form, Icon} from 'antd';
import TrezorUnlockAccount from "../../../modules/account/TrezorUnlockAccount";

class UnlockByTrezor extends React.Component {

  connectTrezor = async () => {
    const {modal} = this.props;
    const path = "m/44'/60'/0'/0";
    window.TrezorConnect.setCurrency('BTC');
    window.TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        window.WALLET = new TrezorUnlockAccount(result);
        window.WALLET_UNLOCK_TYPE = 'Trezor';
        modal.showModal({id: 'wallet/selectAccount', setWallet:this.setWallet})
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
          message={<div className="color-green-600"><Icon type="like" /> Recommended</div>}
          description={<div className="color-green-600">This is a recommended way to access your wallet.</div>}
          type="success"
          showIcon={false}
        />
        <Button type="primary" className="d-block w-100 mt50" size="large" onClick={this.connectTrezor}> Connect</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByTrezor)
