import React from 'react';
import ListFiltersForm from './ListFiltersForm'
import {Button, Modal} from 'antd'
import {generateCancelAllOrdresTx, generateCancelOrdersByTokenPairTx} from 'Loopring/relay/order';
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {toHex} from 'Loopring/common/formatter'
import {configs} from "../../../../common/config/data";
import config from "../../../../common/config";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification';

function ListActionsBar(props) {
  const {actions = {}, LIST = {}, className,id} = props;
  const state = window.STORE.getState() || {}
  const account = state.account
  const gasPrice = state.settings.trading.gasPrice
  const contractAddress = state.settings.trading.contract.address
  const {filters = {}} = LIST[id] || {}
  const tokenPair = filters.market;
  const cancelAll = () => {
    Modal.confirm({
      title: intl.get('order.confirm_cancel_all',{pair:tokenPair}),
      onOk: async () => {
        const seconds = toHex(Math.ceil(new Date().getTime() / 1e3));
        const nonce = await window.STORAGE.wallet.getNonce(account.address);
        const params = {
          gasPrice: toHex(gasPrice * 1e9),
          timestamp: seconds,
          protocolAddress: contractAddress,
          nonce: toHex(nonce)
        };
        let tx;
        if (tokenPair) {
          const tokenA = tokenPair.split('-')[0];
          const tokenB = tokenPair.split('-')[1];
          tx = generateCancelOrdersByTokenPairTx({
            ...params,
            gasLimit: config.getGasLimitByType('cancelOrderByTokenPair') ? config.getGasLimitByType('cancelOrderByTokenPair').gasLimit : configs['defaultGasLimit'],
            tokenA: window.CONFIG.getTokenBySymbol(tokenA === 'ETH' ? 'WETH' : tokenA).address,
            tokenB: window.CONFIG.getTokenBySymbol(tokenB === 'ETH' ? 'WETH' : tokenB).address
          })
        } else {
          tx = generateCancelAllOrdresTx({
            ...params,
            gasLimit: config.getGasLimitByType('cancelAllOrder') ? config.getGasLimitByType('cancelAllOrder').gasLimit : configs['defaultGasLimit'],
          })
        }

        window.WALLET.sendTransaction(tx).then((res) => {
          if (!res.error) {
            window.STORAGE.transactions.addTx({hash: res.result, owner: account.address});
            window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce})
            notifyTransactionSubmitted(res.result);
            Notification.open({message: intl.get('order.cancel_all_success',{pair:tokenPair}), type: "success", description:(<div>Transaction hash is : <a className='color-blue-500' href={`https://etherscan.io/tx/${res.result}`} target='_blank'> {window.uiFormatter.getShortAddress(res.result)}</a></div>)});
          } else {
            Notification.open({message: intl.get('order.cancel_all_failed',{pair:tokenPair}), type: "error", description:res.error.message})
          }
        });


      },
      onCancel: () => {
      },
      okText: intl.get('order.yes'),
      cancelText: intl.get('order.no'),
    })
  }
  return (
    <div className={className}>
      <div className="row ml0 mr0 align-items-center">
        <div className="col-auto">
          <ListFiltersForm actions={actions} LIST={LIST[id]} id={id} />
        </div>
        <div className="col">
        </div>
        <div className="col-auto">
          <Button type="primary" onClick={cancelAll}>{intl.get('order.cancel_all')}</Button>
        </div>
      </div>
    </div>
  )
}
export default ListActionsBar
