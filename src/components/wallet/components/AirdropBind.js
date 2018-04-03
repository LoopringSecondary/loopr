import React from 'react';
import {Button, Card, Form, Input, message, Modal} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {connect} from 'dva';
import {toHex} from "Loopring/common/formatter";
import intl from 'react-intl-universal';

class AirdropBind extends React.Component {

  state = {
    address: null,
    project: null,
  };

  componentDidMount(){
    const {modals} = this.props;
    const modal = modals['wallet/bind'];
    const {project,address} = modal;
    this.setState({
      address,
      project
    });
  }
  showConfirm = (address, project) => {
    const _this = this;
    Modal.confirm({
      title: intl.get('wallet.bind_address_confirm', {project: project.name.toUpperCase(), address}),
      onOk: async () => {
        const {tradingConfig, modal} = _this.props;
        const {project, address} = _this.state;
        const nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
        const tx = generateBindAddressTx({
          projectId: project.projectId,
          address,
          gasPrice: toHex(tradingConfig.gasPrice * 1e9),
          nonce: toHex(nonce)
        });
        window.WALLET.sendTransaction(tx).then(response => {
          if (response.error) {
            message.error(response.error.message)
          } else {
            message.info('bind success');
            //    window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
            window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
            notifyTransactionSubmitted(response.result);
            _this.setState({address: null, project: null});
            modal.hideModal({id: 'wallet/bind'});
          //  modal.hideModal({id: 'wallet/airdrop'});
          }
        });
      },
      onCancel() {
      },
      okText: intl.get('order.yes'),
      cancelText: intl.get('order.no'),

    });
  };

  bindEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const address = e.target.value;
      const project = this.state.project;
      this.showConfirm(address,project);
    }
  };


  addressChange = (e) => {
    this.setState({address: e.target.value})
  };

  render() {
    const {project, address} = this.state;
    return (
      <Card title={intl.get('wallet.bind_tip')}>
        <Form>
          <Form.Item label={intl.get('wallet.bind_type')}>
            <Input
              size="large"
              value={project && project.lrx.toUpperCase()}
              disabled/>
          </Form.Item>
          <Form.Item label={intl.get('wallet.address')}>
            <Input
              size="large"
              placeholder={intl.get('wallet.address_tip')}
              onChange={this.addressChange}
              value={address}
              onKeyDown={this.bindEnter}
            />
          </Form.Item>
        </Form>
        <div className="mb25"></div>
        <Button onClick={this.showConfirm.bind(this, this.state.address, this.state.project)}
                className="w-100 d-block mt15" type="primary" size="large" disabled={!project || !address}>
          {intl.get('wallet.bind_address')}
        </Button>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
  };
}

export default connect(mapStateToProps)(AirdropBind)

