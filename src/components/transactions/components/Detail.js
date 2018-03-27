import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, ListItem} from 'antd';
import {toNumber} from "Loopring/common/formatter";
import intl from 'react-intl-universal'
import {getTransactionByhash} from 'Loopring/ethereum/utils'
const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <div className="row pt10 pb10 zb-b-b">
      <div className="col">
        <div className="fs14 color-grey-600">{label}</div>
      </div>
      <div className="col-8 text-right">
        <div className="fs12 color-grey-900 text-wrap">{render ? render(value) : value}</div>
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
      if(!res.error){
        const ethTx = res.result;
          _this.setState({loading:false,ethTx})
      }else {
        _this.setState({loading:false})
      }
    })
  }

  render() {
    const {modals} = this.props;
    const modal = modals['transaction/detail'];
    const item = modal.item;
    const {ethTx} = this.state;

    const renders = {
      txHash: (value) => <a className="text-truncate d-block" target="_blank"
                            href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber: (value) => <a className="text-truncate d-block" target="_blank"
                                 href={`https://etherscan.io/block/${value}`}>{value}</a>,
      address: (value) => <a className="text-truncate d-block" target="_blank"
                             href={`https://etherscan.io/address/${value}`}>{value}</a>,
    };
    const getType = () => {
      return (
        <div>
          {
            item.type === 'approve' && intl.get('txs.type_enable_title', {symbol: item.symbol})
          }
          {
            item.type === 'send' && intl.get('txs.type_transfer_title', {symbol: item.symbol})
          }
          {
            item.type === 'receive' && intl.get('txs.type_receive_title', {symbol: item.symbol})
          }
          {
            item.type === 'convert_outcome' && item.symbol === 'WETH' && intl.get('txs.type_convert_title_weth')
          }
          {
            item.type === 'convert_outcome' && item.symbol === 'ETH' && intl.get('txs.type_convert_title_eth')
          }
          {
            item.type === 'convert_income' && item.symbol === 'WETH' && intl.get('txs.type_convert_title_eth')
          }
          {
            item.type === 'convert_income' && item.symbol === 'ETH' && intl.get('txs.type_convert_title_weth')
          }
          {
            item.type === 'cancel_order' && intl.get('txs.cancel_order')
          }
          {
            item.type === 'cutoff' && intl.get('txs.cancel_all')
          }
          {
            item.type === 'cutoff_trading_pair' && intl.get('txs.cancel_pair_order', {pair: item.content.market})
          }
          {
            item.type === 'unsupported_contract' && intl.get('txs.unsupported_contract')
          }
        </div>
      )
    };
    const test = () => {
      console.log('Item:', JSON.stringify(item))
    };

    return (
        <Card title="Transaction Detail" loading={this.state.loading} >
          <MetaItem label="Block Number" value={item.blockNumber} render={renders.blockNumber}/>
          <MetaItem label="Status" value={item.status}/>
          <MetaItem label="Confirm Time" value={window.uiFormatter.getFormatTime(toNumber(item.updateTime) * 1e3)}/>
          <MetaItem label="Type" value={getType()}/>
          <MetaItem label="Gas" value={ethTx && window.uiFormatter.getFormatNum(ethTx.gas)}/>
          <MetaItem label="Gas Price" value={ethTx && window.uiFormatter.getFormatNum(toNumber(ethTx.gasPrice)/1e9) + " Gwei"}/>
          <MetaItem label="Nonce" value={ethTx && toNumber(ethTx.nonce)}/>
          <MetaItem label="value" value={ethTx && toNumber(ethTx.value) + ' ETH'}/>
          <MetaItem label="To" value={item.to} render={renders.address}/>
          <MetaItem label="Tx Hash" value={item.txHash} render={renders.txHash}/>
        </Card>
    );
  }

}

export default DetailBlock;
