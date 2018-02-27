import React from 'react';
import {Modal, Collapse, Button, Input, Card} from 'antd';
import {connect} from 'dva';

const TradeConfirm = ({
                        modals,
                        dispatch,
                        tradingConfig,
                        account,
                      }) => {
  const modal = modals['trade/confirm'] || {};
  let {side, pair, amount, price, total, time, marginSplit, lrcFee} = modal;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];
  marginSplit = marginSplit === null ? tradingConfig.marginSplit : marginSplit;
  lrcFee = lrcFee || tradingConfig.lrcFee;
  const start = new Date().getTime() / 1000;
  const since = window.uiFormatter.getFormatTime(start);
  const till = window.uiFormatter.getFormatTime(start + Number(time));
  const order = {};
  order.owner = account.address;

  const handelSubmit = () => {
    // TODO
    modals.hideModal({id: 'trade/confirm'});
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
      <MetaItem label="LRC Fee" value={`${lrcFee} ‰`}/>
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
                              size="large"/>
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


