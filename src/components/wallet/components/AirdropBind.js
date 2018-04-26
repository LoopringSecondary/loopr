import React from 'react';
import {Button, Card, Form, Input, Modal, Icon, Tooltip,Alert} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {connect} from 'dva';
import {toHex} from "Loopring/common/formatter";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification';

class AirdropBind extends React.Component {

  state = {
    address: null,
    project: null,
  };

  componentDidMount() {
    const {page} = this.props;
    const {project} = page;
    if (project) {
      this.setState({
        address: project.address,
        project
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.page !== this.props.page) {
      const {page} = nextProps;
      const {project} = page;
      if (project) {
        this.setState({
          address: project.address,
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
        window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
          if (response.error) {
            Notification.open({
              message: intl.get('wallet.bind_success'),
              type: 'error', description: response.error.message
            })
          } else {
            Notification.open({
              message: intl.get('wallet.bind_success'),
              type: 'success',
              description: (<Button className="alert-btn mr5"
                                    onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('token.transfer_result_etherscan')}</Button>)
            });
            //    window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
            window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
            notifyTransactionSubmitted({txHash:response.result,rawTx,from:window.WALLET.getAddress()});
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
    window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
      if (response.error) {
        Notification.open({
          message: intl.get('wallet.bind_failed'),
          type: 'error', description: response.error.message
        })
      } else {
        Notification.open({
          message: intl.get('wallet.bind_success'),
          type: 'success',
          description: (<Button className="alert-btn mr5"
                                onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('token.transfer_result_etherscan')}</Button>)
        });
        //    window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        notifyTransactionSubmitted({txHash:response.result,rawTx,from:window.WALLET.getAddress()});
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
    const {project, address} = this.state;
    const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address'
    return (
      <Card title={intl.get('wallet.bind_tip')}>
        <Form>
          {
            false &&
            <Form.Item label={null}>
              <Input
                addonBefore={intl.get('wallet.bind_type')}
                size="large"
                value={project && project.lrx.toUpperCase()}
                disabled
              />
            </Form.Item>
          }
          <Form.Item label={null}>
            <Input
              addonBefore={'ETH ' + intl.get('wallet.address')}
              size="large"
              className="fs14"
              value={window.WALLET.getAddress()}
              disabled
            />
          </Form.Item>

          <Form.Item label={null}>
            <Input
              addonBefore={<div style={{minWidth:''}}>{project && project.name} {intl.get('wallet.address')}</div> }
              addonAfter={<Tooltip title={<div>{intl.get('wallet.get_address', {project: project ? project.name : ''})}? <a href={project && project.website} target='_blank'>{intl.get('wallet.go_to', {project: project ? project.name : ''})}</a> </div>}><Icon className="fs3" type="question-circle-o"/></Tooltip>}
              size="large"
              className="fs14"
              placeholder={intl.get('wallet.address_tip', {project: project ? project.name : ''})}
              onChange={this.addressChange}
              value={address}
              onKeyDown={this.bindEnter}
            />
          </Form.Item>
        </Form>
        <Alert className="mb10" type="info" showIcon message={

          <div className="row">
            <div className="col">
              <div className="">{intl.get('airdrop.cost_eth_gas')}</div>
            </div>
            <div className="col-auto">
              <div className="cursor-pointer">0.000018ETH ≈ $0.12<Icon type="right" className="" /></div>
            </div>
          </div>
        }
        />
        {
          isWatchOnly && window.IS_DEMO_WALLET &&
          <Alert className="mb10" type="warning" showIcon message={
            <div className="row">
              <div className="col">
                <div>{intl.get('demo.airdrop_not_allowed')}</div>
              </div>
              <div className="col-auto">
                <div className="cursor-pointer">解锁钱包 <Icon type="right" className="" /></div>
              </div>
            </div>
          }
          />
        }
        {
          isWatchOnly && !window.IS_DEMO_WALLET &&
          <Alert className="mb10" type="error" showIcon message={
            <div className="row">
              <div className="col">
                <div>{intl.get('airdrop.watch_only_not_allowed')}</div>
              </div>
              <div className="col-auto">
                <div className="cursor-pointer">解锁钱包 <Icon type="right" className="" /></div>
              </div>
            </div>

          }
          />
        }
        <Button type='primary' className="d-block w-100" size="large" onClick={this.bindAddress.bind(this, this.state.address, this.state.project)}
                disabled={!project || !address || isWatchOnly}>{intl.get('wallet.bind_address')}</Button>
        <Button type='default' className='d-block w-100 mt10' size="large" onClick={this.cancel}>{intl.get('airdrop.goback')}</Button>
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

