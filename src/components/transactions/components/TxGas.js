import React from 'react';
import {getTransactionByhash, getTransactionRecipt} from 'Loopring/ethereum/utils'
import {getPendingRawTxByHash} from "Loopring/relay/utils";
import {toBig} from "../../../common/Loopring/common/formatter";
import {Icon, Tooltip} from 'antd'
import intl from 'react-intl-universal'


export default class TxGas extends React.Component {

  render() {
    const {item} = this.props;
    const {gas_price, gas_limit, gas_used} = item;
    const gas = item.status.toLowerCase() === 'pending' ? gas_price && gas_limit && toBig(gas_price).times(gas_limit).div('1e18').toFixed(8) : gas_price && gas_used && toBig(gas_price).times(gas_used).div('1e18').toFixed(8)
    return (
      <div className="fs12 color-black-3">
        {gas && <div>
          {gas} ETH Gas
          {(item.type === 'sell' || item.type === 'buy' || item.type === 'lrc_fee' || item.type === 'lrc_reward') &&
          <Tooltip title={intl.get('txs.miner_pay')}>
                      <span className="bg-grey-50 color-black-3 ml5 fs10" style={{padding: '3px 6px'}}>
                        <Icon type="question-circle-o"/>&nbsp;{intl.get('ring.miner')}
                      </span>
          </Tooltip>}
        </div>}
      </div>
    )
  }
}
