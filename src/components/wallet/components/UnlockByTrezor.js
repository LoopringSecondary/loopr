import React from 'react';
import {Button, Form,Alert,Icon} from 'antd';
import {getAddress,sign} from "Loopring/ethereum/trezor";
import TrezorUnlockAccount from "../../../modules/account/TrezorUnlockAccount";
import HDKey from 'hdkey';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
class UnlockByTrezor extends React.Component {

  connectTrezor = async () => {
    const {account, modal} = this.props;
    const path = "m/44'/60'/0'/0";


    // let address = "0x" + await getAddress(path);
    // account.connectToTrezor({address, path});

    window.TrezorConnect.setCurrency('BTC');
    window.TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        const hdk = new HDKey();
        hdk.publicKey  = new Buffer(result.publicKey,'hex');
        hdk.chainCode = new Buffer(result.chainCode,'hex');
        const dkey = hdk.derive(`m/0`);
        const address = publicToAddress(dkey.publicKey, true).toString('hex');
        console.log('Address:',address)
      } else {
        console.error('Error:', result.error); // error message
      }
    });


    modal.hideModal({id: 'wallet/unlock'});
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
