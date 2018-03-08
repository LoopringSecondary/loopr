import React from 'react';
import {connect} from 'dva'
import ListFiltersForm from './ListFiltersForm'
import {Button, Modal} from 'antd'
import {generateCancelAllOrdresTx, generateCancelOrdersByTokenPairTx} from 'Loopring/relay/order';
import {toHex} from 'Loopring/common/formatter'

function ListActionsBar(props) {

  const {actions = {}, LIST = {}, className, account, gasPrice, contractAddress} = props;
  const {filters = {}} = LIST
  const tokenPair = filters.pair;
  const cancelAll = () => {
    Modal.confirm({
      title: 'Do you Want to cancel all orders?',
      content: 'Some descriptions',
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
          const tokenA = tokenPair.split('/')[0];
          const tokenB = tokenPair.split('/')[1];
          tx = generateCancelOrdersByTokenPairTx({
            ...params,
            tokenA: window.CONFIG.getTokenBySymbol(tokenA).address,
            tokenB: window.CONFIG.getTokenBySymbol(tokenB).address
          })
        } else {
          tx = generateCancelAllOrdresTx(params)
        }

        window.WALLET.sendTransaction(tx).then((res) => {
          if (!res.error) {
            window.STORAGE.transactions.addTx({hash: res.result, owner: account.address})
          }else{
           //TODO 跳转到错误页。
          }
        });


      },
      onCancel: () => {
      },
      okText: 'Yes',
      cancelText: 'No',
    })
  }
  return (
    <div className={className}>
      <div className="row ml0 mr0 align-items-center">
        <div className="col-auto">
          <ListFiltersForm actions={actions} LIST={LIST}/>
        </div>
        <div className="col">

        </div>
        <div className="col-auto">
          <Button type="primary" onClick={cancelAll}>Cancel All</Button>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    account: state.account,
    gasPrice: state.settings.trading.gasPrice,
    contractAddress: state.settings.trading.contract.address
  };
}

export default connect(mapStateToProps)(ListActionsBar)
