import React from 'react';
import {Button, Card, Collapse, Input} from 'antd';
import {connect} from 'dva';
import {create} from 'Loopring/ethereum/account';
import {placeOrder, sign} from 'Loopring/relay/order';
import {toBig, toHex, toNumber} from 'Loopring/common/formatter';
import Token from 'Loopring/ethereum/token';
import {configs} from "../../../common/config/data";
import config from "../../../common/config";
import eachLimit from 'async/eachLimit';


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
    const start = Math.ceil(new Date().getTime() / 1000);
    const since = window.uiFormatter.getFormatTime(start);
    const till = window.uiFormatter.getFormatTime(start + Number(timeToLive));
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
    order.validSince = toHex(start);
    order.validUntil = toHex(start + Number(timeToLive));
    order.marginSplitPercentage = Number(marginSplit);
    order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
    order.walletId = toHex(1);
    const authAccount = create('');
    order.authAddr = authAccount.address;
    order.authPrivateKey = authAccount.privateKey;
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
    const title = <div className="text-capitalize">{side} {token}</div>
    return ( <Card title={title}>
      <div className="caption zb-b-b text-center p25 pt0">
        <div className="fs16 color-grey-500 mb5">You are {side === 'sell' ? 'selling' : 'buying'}</div>
        <div className="fs28 color-grey-900">{amount} {token}</div>
        <div className="fs14 color-grey-500 mt5">{price} x {amount} = {total} {token2} </div>
      </div>
      <MetaItem label="LRC Fee" value={`${lrcFee} LRC`}/>
      <MetaItem label="Margin Split" value={`${marginSplit} %`}/>
      <MetaItem label="Valid Since " value={since}/>
      <MetaItem label="Valid Until " value={till}/>
      <Collapse bordered={false} defaultActiveKey={[]}>
        <Collapse.Panel className=""
                        style={{border: 'none', margin: '0px -15px', padding: '0px -15px'}}
                        header={<div style={{}}>Sign</div>}
                        key="1"
        >
          <div className="row">
            <div className="col">
              <div className="fs12 color-grey-500">Raw Order</div>
              <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder=""
                              size="large" value={JSON.stringify(order)}/>
            </div>
            <div className="col">
              <div className="fs12 color-grey-500">Signed Order</div>
              <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder=""
                              size="large" value={JSON.stringify(signedOrder)}/>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>

      <div className="pt15 text-center">
        <div className="fs12 color-grey-500 mb10">
          Submit order is free and does no consume gas
        </div>
        <Button onClick={this.handelSubmit} type="primary" className="d-block w-100" size="large">
          Submit Order
        </Button>
      </div>
    </Card>)
  }

  handelSubmit = async () => {
    const {modals,assets={},tradingConfig} = this.props;
    let {signedOrder,tokenS} = this.state;
    modals.hideModal({id: 'trade/confirm'});
    placeOrder(signedOrder).then(async (res) => {
      if (res.error) {
        modals.showModal({id: 'trade/place-order-error', errors: [{type: 'unknown', message: res.error.message}]});
      } else {
        const allowanceS = assets.getTokenBySymbol(tokenS.symbol,true).allowance;
        const LRC = window.CONFIG.getTokenBySymbol('LRC');
        const allowanceLrc = assets.getTokenBySymbol('lrc',true).allowance;
        const gasPrice = toHex(Number(tradingConfig.gasPrice) * 1e9);
        const delegateAddress = configs.delegateAddress;
        let nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
        const txs = [];
        const gasLimit = config.getGasLimitByType('approve') ? config.getGasLimitByType('approve').gasLimit : configs['defaultGasLimit'];
        if (toBig(tokenS.allowance).greaterThan(allowanceS)) {
          const SToken = new Token({address: tokenS.address});
          if (toNumber(allowanceS) > 0) {
            txs.push(SToken.generateApproveTx({
              spender: delegateAddress,
              amount: '0x0',
              gasPrice,
              gasLimit,
              nonce: toHex(nonce),
            }));
            nonce = nonce + 1;
          }
          txs.push(SToken.generateApproveTx(({
            spender: delegateAddress,
            amount: toHex(toBig('9223372036854775806')),
            gasPrice,
            gasLimit,
            nonce: toHex(nonce),
          })));
          nonce = nonce + 1;
        }
        if (tokenS.address !== LRC.address && toBig(LRC.allowance).greaterThan(allowanceLrc)) {
          const LRCToken = new Token({address: LRC.address});
          if (toNumber(allowanceLrc) > 0) {
            txs.push(LRCToken.generateApproveTx({
              spender: delegateAddress,
              amount: '0x0',
              gasPrice,
              gasLimit,
              nonce: toHex(nonce),
            }));
            nonce = nonce + 1;
          }
          txs.push(LRCToken.generateApproveTx(({
            spender: delegateAddress,
            amount: toHex(toBig('9223372036854775806')),
            gasPrice,
            gasLimit,
            nonce: toHex(nonce),
          })));
        }

        eachLimit(txs, 1, async function (tx, callback) {
          const res = await window.WALLET.sendTransaction(tx);
          if (res.error) {
            callback(res.error.message)
          } else {
            window.STORAGE.transactions.addTx({hash: res.result, owner: window.WALLET.getAddress()});
            window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce});
            callback()
          }
        }, function (error) {

        });
        modals.showModal({id: 'trade/place-order-success'});
      }
    });
  };
}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
  };
}

export default connect(mapStateToProps)(TradeConfirm)


