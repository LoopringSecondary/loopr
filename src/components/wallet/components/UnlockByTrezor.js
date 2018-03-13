import React from 'react';
import {Button, Form, Icon, Alert} from 'antd';
import {getAddress,sign} from "Loopring/ethereum/trezor";
import TrezorUnlockAccount from "../../../modules/account/TrezorUnlockAccount";

const {Item} = Form.Item;

class UnlockByTrezor extends React.Component {

  connectTrezor = async () => {
    const {account, modal} = this.props;
    const path = "m/44'/60'/0'/0/0";
    let address = "0x" + await getAddress(path);
    account.connectToTrezor({address, path});

    modal.hideModal({id: 'wallet/unlock'});
  };

  render() {
    return (
      <div className="text-left">
        <Alert
          message={<div className="color-green-600"><Icon type="like"/> Recommended</div>}
          description={<div className="color-green-600">This is a recommended way to access your wallet.</div>}
          type="success"
          showIcon={false}
        />
        <div className="color-grey-500 fs12 mb10 mt15"></div>
        <Button type="primary" className="d-block w-100" size="large" onClick={this.connectTrezor}> Connect to TREZOR</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByTrezor)
