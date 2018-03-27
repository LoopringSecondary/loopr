import React from 'react';
import {Button, Card, Collapse, Input, Modal,notification} from 'antd';
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

class TradeConfirm extends React.Component {

  state = {
    order: null,
    signedOrder: '',
    since: '',
    till: '',
    tokenB:null,
    tokenS:null
  };

  componentDidMount() {
    const {modals, tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {side, pair, amount, total, timeToLive, marginSplit, lrcFee} = modal;
    const token = pair.split('-')[0];
    const token2 = pair.split('-')[1];
    marginSplit = marginSplit === undefined ? tradingConfig.marginSplit : marginSplit;
    timeToLive = timeToLive === undefined ? window.uiFormatter.getSeconds(tradingConfig.timeToLive, tradingConfig.timeToLiveUnit) : timeToLive;
    const start = new Date().getTime();
    const since = window.uiFormatter.getFormatTime(start);
    const till = window.uiFormatter.getFormatTime(start + Number(timeToLive) * 1000);
    let order = {};
    order.protocol = tradingConfig.contract.address;
    order.owner = window.WALLET.getAddress();
    const tokenB = side.toLowerCase() === "buy" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
    const tokenS = side.toLowerCase() === "sell" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
    order.tokenB = tokenB.address;
    order.tokenS = tokenS.address;
    order.amountB = toHex((side.toLowerCase() === "buy" ? amount : total) * Number('1e' + tokenB.digits));
    order.amountS = toHex((side.toLowerCase() === "sell" ? amount : total) * Number('1e' + tokenS.digits));
    order.lrcFee = toHex(lrcFee * 1e18);
    order.validSince = toHex(Math.ceil(start / 1e3));
    order.validUntil = toHex(Math.ceil(start / 1e3) + Number(timeToLive));
    order.marginSplitPercentage = Number(marginSplit);
    order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
    order.walletId = toHex(1);
    const authAccount = create('');
    order.authAddr = authAccount.address;
    order.authPrivateKey = authAccount.privateKey;
    let toConfirmWarn = '';
    if(window.WALLET_UNLOCK_TYPE === 'Ledger') {
      toConfirmWarn = intl.get('trade.confirm_warn_ledger')
    }
    if(window.WALLET_UNLOCK_TYPE === 'MetaMask') {
      toConfirmWarn = intl.get('trade.confirm_warn_metamask')
    }
    if(window.WALLET_UNLOCK_TYPE === 'Trezor') {
      toConfirmWarn = intl.get('trade.confirm_warn_trezor')
    }

    if(toConfirmWarn) {
      Modal.info({
        title: 'Waiting for your confirmation',
        content: toConfirmWarn,
      });
    }
    window.WALLET.signOrder(order).then(function(signedOrder){
      this.setState({
        order,
        signedOrder,
        since,
        till,
        tokenB,
        tokenS
      })
    }.bind(this)).catch(err=>{
      console.log('signOrder error',err)
    });

  }

  openNotification = () => {

    const args = {
      message: intl.get('order.placing_order'),
      description:  intl.get('order.place_success_tip'),
      duration: 3,
    };
    notification.open(args);

  };

  handelSubmit = async () => {
    const {modals,assets={},tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {warn} = modal;
    let {signedOrder,tokenS} = this.state;
    const _this = this;
    modals.hideModal({id: 'trade/confirm'});
    placeOrder(signedOrder).then(async (res) => {
      if (res.error) {
        modals.showModal({id: 'trade/place-order-error', errors: [{type: 'unknown', message: res.error.message}]});
      } else {
        if(warn){
          const gasLimit = config.getGasLimitByType('approve') ? config.getGasLimitByType('approve').gasLimit : configs['defaultGasLimit'];
          const gasPrice = toHex(Number(tradingConfig.gasPrice) * 1e9);
          const delegateAddress = configs.delegateAddress;
          let nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
          const txs = [];
          const approveWarn = warn.filter(item => item.type === "AllowanceNotEnough");
          approveWarn.forEach(item => {
            const tokenConfig = window.CONFIG.getTokenBySymbol(item.value.symbol);
            const token = new Token({address: tokenConfig.address});
            console.log('Allowance',item.value.allowance);
            if(item.value.allowance > 0){
              console.log('Approve to 0',item.value.symbol);
              txs.push(token.generateApproveTx({
                spender: delegateAddress,
                amount: '0x0',
                gasPrice,
                gasLimit,
                nonce: toHex(nonce),
              }));
              nonce = nonce + 1;
            }
            console.log('Enable',item.value.symbol);
            txs.push(token.generateApproveTx(({
              spender: delegateAddress,
              amount: toHex(toBig('9223372036854775806').times('1e'+ tokenConfig.digits||18)),
              gasPrice,
              gasLimit,
              nonce: toHex(nonce),
            })));
            nonce = nonce + 1;
          });

          eachLimit(txs, 1, async function (tx, callback) {
            const res = await window.WALLET.sendTransaction(tx);
            if (res.error) {
              callback(res.error.message)
            } else {
              window.STORAGE.transactions.addTx({hash: res.result, owner: window.WALLET.getAddress()});
              window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce});
              notifyTransactionSubmitted(res.result);
              callback()
            }
          }, function (error) {

          });
        }
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];

        if(balanceWarn.length ===0){
          this.openNotification()
        }else{
          modals.showModal({id: 'trade/place-order-success',warn:balanceWarn});
        }
        _this.updateOrders();
      }
    });
  };

  updateOrders(){
    const {dispatch} = this.props;
    dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade',
      }
    })
  }
  render() {
    const {modals,tradingConfig} = this.props;
    const modal = modals['trade/confirm'] || {};
    let {side, amount, pair,total, marginSplit, price,lrcFee} = modal;
    let {order, signedOrder, since, till} = this.state;
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
        <div className="fs28 color-grey-900">{intl.get('amount',{amount})} {token}</div>
        <div className="fs14 color-grey-500 mt5">{window.uiFormatter.getFormatNum(price)} x {intl.get('amount',{amount})} = {total} {token2} </div>
      </div>
      <MetaItem label={intl.get('order.lrcfee')} value={`${window.uiFormatter.getFormatNum(lrcFee)} LRC`}/>
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
        <Button onClick={this.handelSubmit} disabled={!signedOrder} type="primary" className="d-block w-100" size="large">
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

export default connect(mapStateToProps)(TradeConfirm)


