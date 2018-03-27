import React from 'react';
import {Link} from 'dva/router';
import {Button, Card, ListItem} from 'antd';
import {getRingByHash} from 'Loopring/relay/ring'
import {toNumber, toBig} from "Loopring/common/formatter";
import intl from 'react-intl-universal'


const MetaItem = (props) => {
  const {label, value, render} = props;
  return (
    <div className="row pt10 pb10 zb-b-b">
      <div className="col">
        <div className="fs14 color-black-2">{label}</div>
      </div>
      <div className="col-8 text-right ">
        <div className="fs14 color-black-1 text-wrap">{render ? render(value) : value}</div>
      </div>
    </div>
  )
};

class DetailBlock extends React.Component {

  state = {
    ring: null
  };

  componentDidMount() {
    const {modal} = this.props;
    const _this = this;
    getRingByHash(modal.item.ringHash).then(res => {
      if (!res.error) {
        _this.setState({ring: res.result});
      }
    });
  }


  getSplitFee = (splitFee) => {
    let totalSplitFee = '';
    if (splitFee) {
      for (let key in splitFee) {
        const token = window.CONFIG.getTokenBySymbol(key);
        totalSplitFee = totalSplitFee !== '' ? totalSplitFee + " + " : totalSplitFee;
        const digits = '1e' + (!!token ? token.digits : '18');
        totalSplitFee = totalSplitFee + window.uiFormatter.getFormatNum((toBig(splitFee[key]).div(digits)).toFixed(token ? token.precision : 6)).concat(' ' + key)
      }
    }
    return totalSplitFee
  };

  render() {
    const {ring} = this.state;
    const renders = {
      txHash: (value) => <a className="text-truncate d-block" target="_blank"
                            href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber: (value) => <a className="text-truncate d-block" target="_blank"
                                 href={`https://etherscan.io/block/${value}`}>{value}</a>,
      address: (value) => <a className="text-truncate d-block" target="_blank"
                             href={`https://etherscan.io/address/${value}`}>{value}</a>,
    };

    return (
      <div className="">
        {ring &&
        <Card title={intl.get('ring.ring_info')}>
          <MetaItem label={intl.get('ring.ring_hash')} value={ring && ring.ringInfo.ringHash}/>
          <MetaItem label={intl.get('ring.miner')} value={ring && ring.ringInfo.miner} render={renders.address}/>
          <MetaItem label={intl.get('txs.tx_hash')} value={ring && ring.ringInfo.txHash} render={renders.txHash}/>
          <MetaItem label={intl.get('txs.block_num')}
                    value={ring && window.uiFormatter.getFormatNum(ring.ringInfo.blockNumber)}
                    render={renders.blockNumber}/>
          <MetaItem label={intl.get('ring.fee_recipient')} value={ring && ring.ringInfo.feeRecipient}
                    render={renders.address}/>
          <MetaItem label={intl.get('ring.total_lrc_fee')}
                    value={ring && (window.uiFormatter.getFormatNum((toNumber(ring.ringInfo.totalLrcFee)/1e18).toFixed(6)) + ' LRC')}/>
          <MetaItem label={intl.get('ring.total_split_fee')}
                    value={ring && this.getSplitFee(ring.ringInfo.totalSplitFee)}/>
          <MetaItem label={intl.get('ring.time')}
                    value={ring && window.uiFormatter.getFormatTime(toNumber(ring.ringInfo.timestamp) * 1e3)}/>
          <MetaItem label={intl.get('ring.trade_amount')}
                    value={ring && window.uiFormatter.getFormatNum(ring.ringInfo.tradeAmount)}/>
          <div className="mb30"></div>
          <Button type="default" className="d-block w-100" size="large"> {intl.get('ring.ring_more_info')}</Button>
        </Card>

        }
      </div>
    );
  }
}

export default DetailBlock;
