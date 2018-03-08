import React from 'react';
import {Button, Form} from 'antd';
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
      <div>
        <Button type="primary" onClick={this.connectTrezor}> Connect</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByTrezor)
