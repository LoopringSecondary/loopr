import React from 'react';
import {Button, Card, Collapse, Input} from 'antd';
import {connect} from 'dva';
import {create} from 'Loopring/ethereum/account';
import {placeOrder, sign} from 'Loopring/relay/order';
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {toBig, toHex, toNumber} from 'Loopring/common/formatter';
import Token from 'Loopring/ethereum/token';
import {configs} from "../../../common/config/data";
import config from "../../../common/config";
import eachLimit from 'async/eachLimit';
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification';
import PropTypes from 'prop-types';

class TradeConfirm extends React.Component {

  state = {
    order: null,
    signedOrder: '',
    since: '',
    till: '',
    tokenB: null,
    tokenS: null,
    loading:false
  };

  componentDidMount() {
    const {modals, tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {side, pair, amount, total, validSince,validUntil, marginSplit, lrcFee} = modal;
    const token = pair.split('-')[0];
    const token2 = pair.split('-')[1];
    marginSplit = marginSplit === undefined ? tradingConfig.marginSplit : marginSplit;
    const since = window.uiFormatter.getFormatTime(validSince * 1e3);
    const till = window.uiFormatter.getFormatTime(validUntil * 1e3);
    let order = {};
    order.delegateAddress = window.CONFIG.getDelegateAddress();
    order.protocol = tradingConfig.contract.address;
    order.owner = window.WALLET.getAddress();
    const tokenB = side.toLowerCase() === "buy" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
    const tokenS = side.toLowerCase() === "sell" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
    order.tokenB = tokenB.address;
    order.tokenS = tokenS.address;
    order.amountB = toHex(toBig(side.toLowerCase() === "buy" ? amount : total).times('1e' + tokenB.digits));
    order.amountS = toHex(toBig(side.toLowerCase() === "sell" ? amount : total).times('1e' + tokenS.digits));
    order.lrcFee = toHex(toBig(lrcFee).times(1e18));
    order.validSince = toHex(validSince);
    order.validUntil = toHex(validUntil);
    order.marginSplitPercentage = Number(marginSplit);
    order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
    order.walletAddress = window.CONFIG.getWalletAddress();
    const authAccount = create('');
    order.authAddr = authAccount.address;
    order.authPrivateKey = authAccount.privateKey;
    let toConfirmWarn = '';
    if (window.WALLET_UNLOCK_TYPE === 'Ledger') {
      toConfirmWarn = intl.get('trade.confirm_warn_ledger')
    }
    if (window.WALLET_UNLOCK_TYPE === 'MetaMask') {
      toConfirmWarn = intl.get('trade.confirm_warn_metamask')
    }
    if (window.WALLET_UNLOCK_TYPE === 'Trezor') {
      toConfirmWarn = intl.get('trade.confirm_warn_trezor')
    }
    if (toConfirmWarn) {
      Notification.open({
        duration:0,
        message: intl.get('trade.to_confirm_title'),
        description: toConfirmWarn,
        type: 'info'
      })
    }
    window.WALLET.signOrder(order).then(function (signedOrder) {
        signedOrder.powNonce = 100;
        this.setState({
          order,
          signedOrder,
          since,
          till,
          tokenB,
          tokenS
        })
      }.bind(this)).catch(err => {
      Notification.open({
        message: intl.get('trade.sign_order_failed'),
        type: "error",
        description: err.message
      })
    });
  }

  ActionItem = (item) => {
    const {modal} = this.props;
    return (
      <div>
        <Button className="alert-btn mr5" onClick={() => modal.showModal({
          id: 'token/receive',
          symbol: item.value.symbol.toUpperCase()
        })}> {intl.get('order.receive_token', {token: item.value.symbol.toUpperCase()})}</Button>
        {item.value.symbol.toUpperCase() !== 'WETH' && item.value.symbol.toUpperCase() !== 'BAR' && item.value.symbol.toUpperCase() !== 'FOO' &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath(`/trade/${item.value.symbol.toUpperCase()}-WETH`)}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {(item.value.symbol.toUpperCase() === 'BAR' || item.value.symbol.toUpperCase() === 'FOO') &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath('/trade/FOO-BAR')}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {item.value.symbol.toUpperCase() === 'WETH' &&
        <Button className="alert-btn mr5" onClick={() => modal.showModal({
          id: 'token/convert',
          item: {symbol: 'ETH'},
          showFrozenAmount: true
        })}> {intl.get('order.convert_token', {token: item.value.symbol.toUpperCase()})}</Button>}
      </div>
    )
  };

  openNotification = (warn) => {
    const args = {
      message: intl.get('order.place_success'),
      description: intl.get('order.place_success_tip'),
      duration: 3,
      type: 'success',
    };
    Notification.open(args);
    warn.forEach((item) => {
      Notification.open({
        message: intl.get('order.place_warn'),
        description: intl.get('order.balance_not_enough', {
          token: item.value.symbol,
          amount: window.uiFormatter.getFormatNum(item.value.required)
        }),
        type: 'warning',
        actions: this.ActionItem(item)
      })
    })
  };

  handelSubmit = async () => {
    const {modals, assets = {}, tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {warn} = modal;
    let {signedOrder} = this.state;
    const _this = this;
    this.setState({loading:true});
    placeOrder(signedOrder).then(async (res) => {
      if (res.error) {
        Notification.open({
          message: intl.get('trade.place_order_failed'),
          type: "error",
          description: res.error.message
        })
      } else {
        if (warn) {
          const gasLimit = config.getGasLimitByType('approve') ? config.getGasLimitByType('approve').gasLimit : configs['defaultGasLimit'];
          const gasPrice = toHex(Number(tradingConfig.gasPrice) * 1e9);
          const delegateAddress = configs.delegateAddress;
          const txs = [];
          const approveWarn = warn.filter(item => item.type === "AllowanceNotEnough");
          let nonce = approveWarn.length > 0 ? await window.STORAGE.wallet.getNonce(window.WALLET.getAddress()) : 0;
          approveWarn.forEach(item => {
            const tokenConfig = window.CONFIG.getTokenBySymbol(item.value.symbol);
            const token = new Token({address: tokenConfig.address});
            if (item.value.allowance > 0) {
              txs.push(token.generateApproveTx({
                spender: delegateAddress,
                amount: '0x0',
                gasPrice,
                gasLimit,
                nonce: toHex(nonce),
              }));
              nonce = nonce + 1;
            }
            txs.push(token.generateApproveTx(({
              spender: delegateAddress,
              amount: toHex(toBig('9223372036854775806').times('1e' + tokenConfig.digits || 18)),
              gasPrice,
              gasLimit,
              nonce: toHex(nonce),
            })));
            nonce = nonce + 1;
          });

          eachLimit(txs, 1, async function (tx, callback) {
            const {response, rawTx} = await window.WALLET.sendTransaction(tx);
            if (response.error) {
              callback(response.error.message)
            } else {
              //  window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
              window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
              notifyTransactionSubmitted({txHash: response.result, rawTx, from: window.WALLET.getAddress()});
              callback()
            }
          }, function (error) {
            _this.reEmitPendingTransaction();
            if(error){
              Notification.open({
                message: intl.get('trade.place_order_failed'),
                type: "error",
                description: error.message
              });
            }else {
              const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
              _this.openNotification(balanceWarn);
              _this.updateOrders();
            }
            _this.setState({loading:false});
             modals.hideModal({id: 'trade/confirm'});
          });
        } else {
          const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
          this.openNotification(balanceWarn);
          this.setState({loading:false});
          modals.hideModal({id: 'trade/confirm'});
          _this.updateOrders();
        }
      }
    });
  };

  updateOrders() {
    const {dispatch} = this.props;
    dispatch({
      type: 'orders/filtersChange',
      payload: {
        id: 'orders/trade',
      }
    })
  }

  reEmitPendingTransaction = () => {
    const {socket} = this.context;
    const owner = window.WALLET && window.WALLET.getAddress();
    const options = {
      owner
    };
    socket.emit('pendingTx_req', JSON.stringify(options))
  };

  render() {
    const {modals, tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {side, amount, pair, total, marginSplit, price, lrcFee} = modal;
    let {order, signedOrder, since, till,loading} = this.state;
    marginSplit = marginSplit === undefined ? tradingConfig.marginSplit : marginSplit;
    const token = pair.split('-')[0];
    const token2 = pair.split('-')[1];

    const MetaItem = (props) => {
      const {label, value} = props;
      return (
        <div className="row zb-b-b pt10 pb10 no-gutters">
          <div className="col">
            <div className="fs14 color-grey-600">{label}</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">{value}</div>
          </div>
        </div>
      )
    }
    const title = <div className="text-capitalize">{intl.get(`order.${side}`)} {token}</div>
    return ( <Card title={title}>
      <div className="caption zb-b-b text-center p25 pt0">
        <div className="fs16 color-grey-500 mb5">{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</div>
        <div className="fs28 color-grey-900">{intl.get('global.amount', {amount})} {token}</div>
        <div className="fs14 color-grey-500 mt5">{window.uiFormatter.getFormatNum(price)}
          x {intl.get('global.amount', {amount})} = {total} {token2} </div>
      </div>
      <MetaItem label={intl.get('trade.lrc_fee')} value={`${window.uiFormatter.getFormatNum(lrcFee)} LRC`}/>
      <MetaItem label={intl.get('order.margin')} value={`${marginSplit} %`}/>
      <MetaItem label={intl.get('order.since')} value={since}/>
      <MetaItem label={intl.get('order.till')} value={till}/>
      <Collapse bordered={false} defaultActiveKey={[]}>
        <Collapse.Panel className=""
                        style={{border: 'none', margin: '0px -15px', padding: '0px -15px'}}
                        header={<div style={{}}>{intl.get('order.sign')}</div>}
                        key="1"
        >
          <div className="row">
            <div className="col">
              <div className="fs12 color-grey-500">{intl.get('order.raw')}</div>
              <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder=""
                              size="large" value={JSON.stringify(order)}/>
            </div>
            <div className="col">
              <div className="fs12 color-grey-500">{intl.get('order.signed')}</div>
              <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder=""
                              size="large" value={JSON.stringify(signedOrder)}/>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>

      <div className="pt15 text-center">
        <div className="fs12 color-grey-500 mb10">
          {intl.get('order.place_tip')}
        </div>
        <Button onClick={this.handelSubmit} disabled={!signedOrder && loading} type="primary" className="d-block w-100"
                size="large" loading={loading}>
          {intl.get('order.submit')}
        </Button>
      </div>
    </Card>)
  }

}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
  };
}

TradeConfirm.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(TradeConfirm)


