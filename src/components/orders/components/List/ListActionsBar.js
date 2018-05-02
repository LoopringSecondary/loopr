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
import PropTypes from 'prop-types';

class ListActionsBar extends React.Component {

  render(){
    const {actions = {}, LIST = {}, className,id} = this.props;
    const {filters = {},  items} = LIST[id] || {}
    const hasOpenedOrder = items && items.filter(item=> item.status === "ORDER_OPENED").length>1
    const tokenPair = filters.market;
    const { socket } = this.context;
    const reEmitPendingTransaction= () => {
      const owner = window.WALLET && window.WALLET.getAddress();
      const options = {
        owner
      };
      socket.emit('pendingTx_req', JSON.stringify(options))
    };


    const showModal = (payload = {}) => {
      window.STORE.dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        },
      })
    }

    const cancelAll = async () => {
      const state = window.STORE.getState()
      const account = state.account
      const gasPrice = state.settings.trading.gasPrice
      const contractAddress = state.settings.trading.contract.address
      if(state && state.account && state.account.walletType === 'Address') {
        this.props.dispatch({
          type:'modals/modalChange',
          payload:{
            id:'wallet/watchOnlyToUnlock',
            originalData:{},
            pageFrom:'',
            visible:true
          }
        })
        return
      }
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

      showModal({id:"order/cancel/confirm",type:'all',market:tokenPair|| '',tx});


      // Modal.confirm({
      //   title: intl.get('order.confirm_cancel_all',{pair:tokenPair}),
      //   onOk: async () => {
      //     const seconds = toHex(Math.ceil(new Date().getTime() / 1e3));
      //     const nonce = await window.STORAGE.wallet.getNonce(account.address);
      //     const params = {
      //       gasPrice: toHex(gasPrice * 1e9),
      //       timestamp: seconds,
      //       protocolAddress: contractAddress,
      //       nonce: toHex(nonce)
      //     };
      //     let tx;
      //     if (tokenPair) {
      //       const tokenA = tokenPair.split('-')[0];
      //       const tokenB = tokenPair.split('-')[1];
      //       tx = generateCancelOrdersByTokenPairTx({
      //         ...params,
      //         gasLimit: config.getGasLimitByType('cancelOrderByTokenPair') ? config.getGasLimitByType('cancelOrderByTokenPair').gasLimit : configs['defaultGasLimit'],
      //         tokenA: window.CONFIG.getTokenBySymbol(tokenA === 'ETH' ? 'WETH' : tokenA).address,
      //         tokenB: window.CONFIG.getTokenBySymbol(tokenB === 'ETH' ? 'WETH' : tokenB).address
      //       })
      //     } else {
      //       tx = generateCancelAllOrdresTx({
      //         ...params,
      //         gasLimit: config.getGasLimitByType('cancelAllOrder') ? config.getGasLimitByType('cancelAllOrder').gasLimit : configs['defaultGasLimit'],
      //       })
      //     }
      //
      //     window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
      //       if (!response.error) {
      //         //window.STORAGE.transactions.addTx({hash: response.result, owner: account.address});
      //         window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce});
      //         notifyTransactionSubmitted({txHash:response.result,rawTx,from :window.WALLET.getAddress()}).then(()=> reEmitPendingTransaction());
      //         Notification.open({message: intl.get('order.cancel_all_success',{pair:tokenPair}), type: "success", description:(<Button className="alert-btn mr5" onClick={() => window.open(`https://etherscan.io/tx/${response.result}`,'_blank')}> {intl.get('token.transfer_result_etherscan')}</Button> )});
      //       } else {
      //         Notification.open({message: intl.get('order.cancel_all_failed',{pair:tokenPair}), type: "error", description:response.error.message})
      //       }
      //     });
      //   },
      //   onCancel: () => {
      //   },
      //   okText: intl.get('order.yes'),
      //   cancelText: intl.get('order.no'),
      // })
    };
    return (
      <div className={className}>
        <div className="row ml0 mr0 align-items-center">
          <div className="col-auto">
            <ListFiltersForm actions={actions} LIST={LIST[id]} id={id} />
          </div>
          <div className="col">
          </div>
          <div className="col-auto">
            {hasOpenedOrder && <Button type="primary" onClick={cancelAll}>{intl.get('order.cancel_all')}</Button>}
          </div>
        </div>
      </div>
    )
  }

}
ListActionsBar.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default ListActionsBar
