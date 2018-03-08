import React from 'react';
import {Button, Form,Alert,Icon} from 'antd';
import {getAddress,sign} from "Loopring/ethereum/trezor";

class UnlockByTrezor extends React.Component {

  connectTrezor = async () => {
    const {account, modal} = this.props;
    const path = "m/44'/60'/0'/0/0";
    const address = await getAddress(path);
    account.connectToTrezor({address});
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
