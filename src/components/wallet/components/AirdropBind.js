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
    loading: false
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
        return window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
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

  addressChange = (e) => {
    this.setState({address: e.target.value})
  };

  render() {
    const {form, account} = this.props
    const {project, address} = this.state;
    const isWatchOnly = account.walletType === 'Address'
    const _this = this

    const bindAddress = (address, project) => {
      form.validateFields(async (err, values) => {
        if (!err) {
          _this.setState({loading:true})
          const {tradingConfig, page} = this.props;
          const state = window.STORE.getState()
          if(state && state.account && state.account.walletType === 'Address') {
            page.onClose();
            this.props.dispatch({
              type:'modals/modalChange',
              payload:{
                id:'wallet/airdrop',
                visible:false
              }
            })
            this.props.dispatch({
              type:'modals/modalChange',
              payload:{
                id:'wallet/watchOnlyToUnlock',
                originalData:{id:'wallet/airdrop'},
                pageFrom:'',
                visible:true
              }
            })
            _this.setState({loading:false})
            return
          }
          const nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
          const tx = generateBindAddressTx({
            projectId: project.projectId,
            address,
            gasPrice: toHex(tradingConfig.gasPrice * 1e9),
            nonce: toHex(nonce)
          });
          window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
            if (response.error) {
              _this.setState({loading:false})
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
              this.setState({address: null, project: null,loading:false});
              page.onClose();
              // modal.hideModal({id: 'wallet/bind'});
              // modal.hideModal({id: 'wallet/airdrop'});
            }
          }).catch(e=>{
            _this.setState({loading:false})
          });
        } else {
          _this.setState({loading:false})
        }
      })
    };

    const bindEnter = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        const address = e.target.value;
        const project = this.state.project;
        bindAddress(address, project);
      }
    };

    async function validateAddress(value) {
      console.log(value)
      if(project.projectId ===1){

        if(value && value.length === 34){
          return await window.AntShares.Wallets.Wallet.toScriptHash(value);
        }
        return false;
      }else{
        return value
      }
    }

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
            {form.getFieldDecorator('ethAddress', {
              initialValue: account.address
            })(
              <Input
                addonBefore={'ETH ' + intl.get('wallet.address')}
                size="large"
                className="fs14"
                disabled
              />
            )}
          </Form.Item>
          <Form.Item label={null}>
            {form.getFieldDecorator('neoAddress', {
              initialValue: address,
              rules: [{
                message: intl.get('airdrop.address_null',{token:project && project.name}),
                validator: async (rule, value, cb) => await validateAddress(value) ? cb() : cb(true)
              }]
            })(
              <Input
                addonBefore={<div style={{minWidth:''}}>{project && project.name} {intl.get('wallet.address')}</div> }
                addonAfter={<Tooltip title={<div>{intl.get('wallet.get_address', {project: project ? project.name : ''})}? <a href={project && project.website} target='_blank'>{intl.get('wallet.go_to', {project: project ? project.name : ''})}</a> </div>}><Icon className="fs3" type="question-circle-o"/></Tooltip>}
                size="large"
                className="fs14"
                placeholder={intl.get('wallet.address_tip', {project: project ? project.name : ''})}
                onChange={this.addressChange}
                onKeyDown={bindEnter}
              />
            )}
          </Form.Item>
        </Form>
        <Alert className="mb10" type="info" showIcon message={
          <div className="row">
            <div className="col">
              <div className="">{intl.get('airdrop.cost_eth_gas')}</div>
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
            </div>

          }
          />
        }
        <Button type='primary' className="d-block w-100" size="large" onClick={bindAddress.bind(this, this.state.address, this.state.project)} loading={this.state.loading}>
          {intl.get('wallet.bind_address')}
        </Button>
        <Button type='default' className='d-block w-100 mt10' size="large" onClick={this.cancel}>{intl.get('airdrop.goback')}</Button>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
    account: state.account
  }
}

export default connect(mapStateToProps)(
  Form.create({
    mapPropsToFields(props) {
      return {
        ethAddress: Form.createFormField(
          props.account.address
        ),
      }
    }
  })(
    AirdropBind
  )
)

