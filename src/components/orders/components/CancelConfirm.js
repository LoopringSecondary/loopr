import React from 'react'
import {Alert, Button, Card, Icon} from 'antd'
import {getDisplaySymbol, toBig} from "../../../common/Loopring/common/formatter";
import * as math from '../../../common/Loopring/common/math'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import PropTypes from 'prop-types';

class CancelConfirm extends React.Component {
  state = {
    loading: false
  };
  reEmitPendingTransaction = () => {
    const {socket} = this.context;
    const owner = window.WALLET && window.WALLET.getAddress();
    const options = {
      owner
    };
    socket.emit('pendingTx_req', JSON.stringify(options))
  };

  cancel = () => {
    const {modal} = this.props;
    modal.hideThisModal()
  };

  ConfirmCancel = () => {
    const {modal} = this.props;
    const {tx,type,market} = modal;
    const _this = this;
    this.setState({loading:true});
    window.WALLET.sendTransaction(tx).then(({response, rawTx}) => {
      _this.cancel();
      _this.setState({loading:false});
      if (!response.error) {
        // window.STORAGE.transactions.addTx({hash: response.result, owner: account.address});
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        notifyTransactionSubmitted({txHash: response.result, rawTx, from: window.WALLET.getAddress()}).then(() => {
          this.reEmitPendingTransaction()
        });
        Notification.open({
          message: type === 'order'? intl.get('order.cancel_order_success'): intl.get('order.cancel_all_success',{pair:market}),
          type: "success",
          description: (<Button className="alert-btn mr5"
                                onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('token.transfer_result_etherscan')}</Button> )
        });
      } else {
        Notification.open({
          message: type === 'order'? intl.get('order.cancel_order_failed') : intl.get('order.cancel_all_failed',{pair:market}),
          type: "error",
          description: response.error.message
        })
      }
    })
  };

  render() {
    const {modal, prices} = this.props;
    const {loading} = this.state;
    const {tx, type, market} = modal;
    const price = prices.getTokenBySymbol('ETH');
    const amount = toBig(tx.gasPrice).times(tx.gasLimit).div(1e18).toNumber()
    const worth = `${getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${math.accMul(amount, price.price).toFixed(2)}`

    const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address';
    const title = type === 'order' ? intl.get('order.confirm_cancel_order') : intl.get('order.confirm_cancel_all', {pair: market || ''})
    return (
      <Card title={title}>
        <Alert className="mb10" type="info" showIcon message={
          <div className="row">
            <div className="col">
              <div className="">{intl.get('orders.auto_cancel_not_cost_gas')}</div>
            </div>
            <div className="col-auto">
              <Button type='primary' className='d-block w-100' size="small" disabled={loading}
                      onClick={this.cancel}>{intl.get('order.no')}</Button>
            </div>
          </div>
        }/>
        <Alert className="mb10" type="info" showIcon message={
          <div className="row">
            <div className="col">
              <div className="">{intl.get('orders.cancel_cost_gas')}</div>
            </div>
            <div className="col-auto">
              {
                false &&
                <div className="">{amount.toFixed(8)}ETH ≈ {worth}</div>
              }
              <Button type='primary' className="d-block w-100" size="small" loading={loading} onClick={this.ConfirmCancel}
                      disabled={isWatchOnly || loading}>{intl.get('order.yes')}</Button>
            </div>
          </div>
        }/>



      </Card>
    )
  }
}

CancelConfirm.contextTypes = {
  socket: PropTypes.object.isRequired
};


export default CancelConfirm
