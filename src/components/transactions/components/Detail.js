import React from 'react';
import {Link} from 'dva/router';
import {Card,Spin} from 'antd';
import {toNumber} from "Loopring/common/formatter";
import intl from 'react-intl-universal'
import {getTransactionByhash} from 'Loopring/ethereum/utils'

const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <div className="row pt10 pb10 zb-b-b">
      <div className="col">
        <div className="fs14 color-black-2">{label}</div>
      </div>
      <div className="col-8 text-right">
        <div className="fs14 color-black-1 text-wrap">{render ? render(value) : value}</div>
      </div>
    </div>
  )
};


class DetailBlock extends React.Component {

  state = {
    ethTx: null,
    loading: true
  };

  componentDidMount() {
    const {modals} = this.props;
    const modal = modals['transaction/detail'];
    const item = modal.item;
    const _this = this;
    getTransactionByhash(item.txHash).then(res => {
      if (!res.error) {
        const ethTx = res.result;
        _this.setState({loading: false, ethTx})
      } else {
        _this.setState({loading: false})
      }
    })
  }

  render() {
    const {modals} = this.props;
    const modal = modals['transaction/detail'];
    const item = modal.item;
    const {ethTx,loading} = this.state;

    const renders = {
      txHash: (value) => <a className="text-truncate d-block" target="_blank"
                            href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber: (value) => <a className="text-truncate d-block" target="_blank"
                                 href={`https://etherscan.io/block/${value}`}>{value}</a>,
      address: (value) => <a className="text-truncate d-block" target="_blank"
                             href={`https://etherscan.io/address/${value}`}>{value}</a>,
    };
    const getType = () => {

      switch (item.type) {
        case 'approve':
          return intl.get('txs.type_enable_title', {symbol: item.symbol});
        case 'send':
          return intl.get('txs.type_transfer_title', {symbol: item.symbol});
        case 'receive':
          return intl.get('txs.type_receive_title', {symbol: item.symbol});
        case 'convert_outcome':
          return item.symbol === 'ETH' ? intl.get('txs.type_convert_title_eth') : intl.get('txs.type_convert_title_weth');
        case 'convert_income':
          return item.symbol === 'WETH' ? intl.get('txs.type_convert_title_eth'): intl.get('txs.type_convert_title_weth');
        case 'cancel_order':
          return intl.get('txs.cancel_order')
        case 'cutoff':
          return intl.get('txs.cancel_all');
        case 'cutoff_trading_pair':
          return intl.get('txs.cancel_pair_order', {pair: item.content.market});
        default:
          return intl.get('txs.others')
      }
    };
    return (
      <Card title={intl.get('txs.tx_detail')}>
        <Spin spinning={loading}>
          <MetaItem label={intl.get('txs.tx_hash')} value={item.txHash} render={renders.txHash}/>
          <MetaItem label={intl.get('txs.to')} value={item.to} render={renders.address}/>
          <MetaItem label={intl.get('txs.block_num')} value={item.blockNumber} render={renders.blockNumber}/>
          <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + item.status)}/>
          <MetaItem label={intl.get('txs.confirm_time')}
                    value={window.uiFormatter.getFormatTime(toNumber(item.updateTime) * 1e3)}/>
          <MetaItem label={intl.get('txs.type')} value={getType()}/>
          <MetaItem label={intl.get('token.gas_limit')} value={ethTx && window.uiFormatter.getFormatNum(ethTx.gas)}/>
          <MetaItem label={intl.get('token.gas_price')}
                    value={ethTx && window.uiFormatter.getFormatNum(toNumber(ethTx.gasPrice) / 1e9) + " Gwei"}/>
          <MetaItem label={intl.get('wallet.nonce')} value={ethTx && toNumber(ethTx.nonce)}/>
          <MetaItem label={intl.get('txs.value')} value={ethTx && toNumber(ethTx.value) + ' ETH'}/>
        </Spin>
      </Card>
    );
  }

}

export default DetailBlock;
