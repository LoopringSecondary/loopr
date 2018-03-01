import React from 'react';
import {Modal, Collapse, Button, Input, Card} from 'antd';
import {connect} from 'dva';
import {create} from 'Loopring/ethereum/account';
import {sign} from 'Loopring/relay/order';
import {toHex, toBig, toNumber} from 'Loopring/common/formatter';
import Token from 'Loopring/ethereum/token';
import {getTransactionCount} from 'Loopring/ethereum/utils';
import {configs} from "../../../common/config/data";
import {placeOrder} from 'Loopring/relay/order';

const TradeConfirm = ({
                        modals,
                        dispatch,
                        tradingConfig,
                        account
                      }) => {
  const modal = modals['trade/confirm'] || {};
  let {side, pair, amount, price, total, timeToLive, marginSplit, lrcFee} = modal;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];
  marginSplit = marginSplit === undefined ? tradingConfig.marginSplit : marginSplit;
  lrcFee = lrcFee || tradingConfig.lrcFee;
  timeToLive = timeToLive === undefined ? window.uiFormatter.getSeconds(tradingConfig.timeToLive, tradingConfig.timeToLiveUnit) : timeToLive;
  const start = Math.ceil(new Date().getTime() / 1000);
  const since = window.uiFormatter.getFormatTime(start);
  const till = window.uiFormatter.getFormatTime(start + Number(timeToLive));
  const order = {};
  order.protocol = tradingConfig.contract.address;
  order.owner = account.address;
  const tokenB = side.toLowerCase() === "buy" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
  const tokenS = side.toLowerCase() === "sell" ? window.CONFIG.getTokenBySymbol(token) : window.CONFIG.getTokenBySymbol(token2);
  order.tokenB = tokenB.address;
  order.tokenS = tokenS.address;
  order.amountB = toHex((side.toLowerCase() === "buy" ? amount : total) * Number('1e' + tokenB.digits));
  order.amountS = toHex((side.toLowerCase() === "sell" ? amount : total) * Number('1e' + tokenS.digits));
  order.lrcFee = toHex(lrcFee * amount * 1e18);//TODO 根据价格比例计算。
  order.validSince = toHex(start);
  order.validUntil = toHex(start + Number(timeToLive));
  order.marginSplitPercentage = Number(marginSplit);
  order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
  order.walletId = 1;
  const authAccount = create('');
  order.authAddr = authAccount.address;
  order.authKey = authAccount.privateKey;
  const signedOrder = sign(order, account.privateKey);

  const handelSubmit = async () => {
    // TODO
    modals.hideModal({id: 'trade/confirm'});
    //TODO Enable 设置allowance 数量进行模拟，后期根据真实数据进行修改

    const allowanceToken1 = 50;
    const allowanceToken2 = 100;
    const allowanceS = side === 'buy' ? allowanceToken2 : allowanceToken1;
    const LRC = window.CONFIG.getTokenBySymbol('LRC');
    const allowanceLrc = 10;
    const gasPrice = toHex(Number(tradingConfig.gasPrice) * 1e9);
    const delegateAddress = configs.delegateAddress;
    let nonce = toNumber((await getTransactionCount(account.address)).result);


    if (toBig(tokenS.allowance).greaterThan(allowanceS * Number('1e' + tokenS.digits))) {
      const SToken = new Token({address: tokenS.address});
      if (allowanceS > 0) {
        await SToken.approve({
          privateKey: account.privateKey,
          spender: delegateAddress,
          amount: '0x0',
          gasPrice,
          nonce: toHex(nonce)
        });
        nonce = nonce + 1;
        await SToken.approve(({
          privateKey: account.privateKey,
          spender: delegateAddress,
          amount: toHex(toBig('9223372036854775806')),
          gasPrice,
          nonce: toHex(nonce)
        }));
        nonce = nonce + 1;
      }
    }

    if (tokenS.address !== LRC.address && toBig(LRC.allowance).greaterThan(allowanceLrc * Number('1e' + LRC.digits))) {
      const LRCToken = new Token({address: LRC.address});
      if (allowanceS > 0) {
        await LRCToken.approve({
          privateKey: account.privateKey,
          spender: delegateAddress,
          amount: '0x0',
          gasPrice,
          nonce: toHex(nonce)
        });
        nonce = nonce + 1;
        await LRCToken.approve(({
          privateKey: account.privateKey,
          spender: delegateAddress,
          amount: toHex(toBig('9223372036854775806')),
          gasPrice,
          nonce: toHex(nonce)
        }));
      }
    }

    await placeOrder(signedOrder);

    modals.showModal({id: 'trade/steps'})
  };

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
  return (
    <Card title={title}>
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
        <Button onClick={handelSubmit} type="primary" className="d-block w-100" size="large">
          Submit Order
        </Button>
      </div>
    </Card>
  );
};


function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
    account: state.account
  };
}

export default connect(mapStateToProps)(TradeConfirm)


