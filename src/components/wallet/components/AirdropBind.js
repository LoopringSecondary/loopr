import React from 'react';
import {Button, Card, Form, Input, Modal} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {connect} from 'dva';
import {toHex} from "Loopring/common/formatter";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification';
import {Page} from 'Loopr/Pages';

class AirdropBind extends React.Component {

  state = {
    address: null,
    project: null,
  };

  componentDidMount() {
    const {page} = this.props;
    const {project} = page;
    if(project){
      this.setState({
        address:project.address,
        project
      });
    }
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.page !== this.props.page){
      const {page} = nextProps;
      const {project} = page;
      if(project){
        this.setState({
          address:project.address,
          project
        });
      }
    }
    return true
  }

  cancel = () => {
    const {page} = this.props;
    this.setState({address: null, project: null});
    page.onClose();
  };

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
            Notification.open({
              message: intl.get('wallet.bind_success'),
              type: 'error', description: response.error.message
            })
          } else {
            Notification.open({
              message: intl.get('wallet.bind_success'),
              type: 'success',
              description:(<Button className="alert-btn mr5" onClick={() => window.open(`https://etherscan.io/tx/${response.result}`,'_blank')}> {intl.get('token.transfer_result_etherscan')}</Button>)
            });
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

  bindAddress = async (address, project) => {
    const {tradingConfig, page} = this.props;
    const nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
    const tx = generateBindAddressTx({
      projectId: project.projectId,
      address,
      gasPrice: toHex(tradingConfig.gasPrice * 1e9),
      nonce: toHex(nonce)
    });
    window.WALLET.sendTransaction(tx).then(response => {
      if (response.error) {
        Notification.open({
          message: intl.get('wallet.bind_success'),
          type: 'error', description: response.error.message
        })
      } else {
        Notification.open({
          message: intl.get('wallet.bind_success'),
          type: 'success',
          description:(<Button className="alert-btn mr5" onClick={() => window.open(`https://etherscan.io/tx/${response.result}`,'_blank')}> {intl.get('token.transfer_result_etherscan')}</Button>)
        });
        //    window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        notifyTransactionSubmitted(response.result);
        this.setState({address: null, project: null});
        page.onClose();
       // modal.hideModal({id: 'wallet/bind'});
        // modal.hideModal({id: 'wallet/airdrop'});
      }
    });

  };
  bindEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const address = e.target.value;
      const project = this.state.project;
      this.bindAddress(address, project);
    }
  };


  addressChange = (e) => {
    this.setState({address: e.target.value})
  };

  render() {
    const {project,address} = this.state;
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
        <div className="pt15 d-flex float-right ">
          <Button type='default' className='mr30' onClick={this.cancel}>{intl.get('wallet.cancel')}</Button>
          <Button type='primary' onClick={this.bindAddress.bind(this, this.state.address, this.state.project)} disabled={!project || !address}>   {intl.get('wallet.bind_address')}</Button>
        </div>
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

