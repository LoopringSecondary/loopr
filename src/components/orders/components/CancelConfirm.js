import React from 'react'
import {Alert, Button, Card, Icon} from 'antd'
import {getDisplaySymbol, toBig, toNumber} from "../../../common/Loopring/common/formatter";
import * as math from '../../../common/Loopring/common/math'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import PropTypes from 'prop-types';
import moment from 'moment'


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
    const {tx, type, market} = modal;
    const _this = this;
    this.setState({loading: true});
    window.WALLET.sendTransaction(tx).then(({response, rawTx}) => {
      _this.cancel();
      _this.setState({loading: false});
      if (!response.error) {
        // window.STORAGE.transactions.addTx({hash: response.result, owner: account.address});
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        notifyTransactionSubmitted({txHash: response.result, rawTx, from: window.WALLET.getAddress()}).then(() => {
          this.reEmitPendingTransaction()
        });
        Notification.open({
          message: type === 'order' ? intl.get('order.cancel_order_success') : intl.get('order.cancel_all_success', {pair: market}),
          type: "success",
          description: (<Button className="alert-btn mr5"
                                onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('token.transfer_result_etherscan')}</Button> )
        });
      } else {
        Notification.open({
          message: type === 'order' ? intl.get('order.cancel_order_failed') : intl.get('order.cancel_all_failed', {pair: market}),
          type: "error",
          description: response.error.message
        })
      }
    })
  };

  computeTime = (until) => {
    const now = Math.floor(moment().valueOf() / 1e3);
    const days = Math.floor((until - now)/(3600*24));
    const hours = Math.floor(((until-now) % (3600 *24)) / 3600);
    const minutes = Math.ceil(((until -now) % 3600)/60);
    return {days,hours,minutes}
  };

  render() {
    const {modal, prices} = this.props;
    const {loading} = this.state;
    const {tx, type, market, order} = modal;
    const price = prices.getTokenBySymbol('ETH');
    const amount = toBig(tx.gasPrice).times(tx.gasLimit).div(1e18).toNumber();
    const worth = `${getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${math.accMul(amount, price.price).toFixed(2)}`
    const title = type === 'order' ? intl.get('order.confirm_cancel_order') : intl.get('order.confirm_cancel_all', {pair: market || ''})
    return (
      <Card title={title}>
        {type === 'order' &&
        <div>
          <div className="p15 pb25 text-center">
            <div className="fs12 pt5 color-black-2">{intl.get('orders.order_will_expire')}</div>
            <div className="fs30 color-black-1">
              {intl.get("orders.expire_duration", this.computeTime(toNumber(order.validUntil)))}
            </div>
            <div
              className="fs12 pt5 pb5 color-black-2">{intl.get('orders.order_validity')}：{window.uiFormatter.getFormatTime(toNumber(order.validSince) * 1e3)} ~ {window.uiFormatter.getFormatTime(toNumber(order.validUntil) * 1e3)}</div>
          </div>

        </div>}
        <Alert className="mb10" type="info" showIcon message={
            <div className="row align-items-center">
              <div className="col">
                <div className="color-black-2 fs14">{intl.get('orders.auto_cancel_not_cost_gas')}</div>
              </div>
              <div className="col-auto">
                {
                  !loading &&
                  <a onClick={this.cancel} className="color-primary-1 fs12 cursor-pointer">
                    {intl.get('orders.wait_expire')}
                    <Icon type="right"/>
                  </a>
                }
                {
                  loading &&
                  <a className="color-black-3 fs12 cursor-pointer">
                    {intl.get('orders.wait_expire')}
                  </a>
                }
              </div>
            </div>
          }/>
        <Alert className="mb10" type="info" showIcon message={
          <div className="row align-items-center">
            <div className="col">
              <div className="color-black-2 fs14">{intl.get('orders.manual_cancel_cost_gas')}</div>
            </div>
            <div className="col-auto">
              {
                false &&
                <div className="">{amount.toFixed(8)}ETH ≈ {worth}</div>
              }
              {
                !loading &&
                <a onClick={this.ConfirmCancel} className="color-primary-1 fs12 cursor-pointer">
                  {intl.get('orders.confirm_to_cancel')}
                  <Icon type="right"/>
                </a>
              }
              {
                loading &&
                <a className="color-black-3 fs12 cursor-pointer">
                  {intl.get('orders.canceling')}
                </a>
              }
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
