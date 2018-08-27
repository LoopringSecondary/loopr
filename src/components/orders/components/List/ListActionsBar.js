import React from 'react';
import ListFiltersForm from './ListFiltersForm'
import {Button, Modal} from 'antd'
import {generateCancelAllOrdresTx, generateCancelOrdersByTokenPairTx} from 'Loopring/relay/order';
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {toHex} from 'Loopring/common/formatter'
import config from "../../../../common/config";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification';
import PropTypes from 'prop-types';
import {sha3} from 'ethereumjs-util'
import {connect} from 'dva';
import {flexCancelOrder} from '../../../../common/Loopring/relay/order'
import moment from 'moment'


class ListActionsBar extends React.Component {

  render(){
    const {actions = {}, LIST = {}, className,id,dispatch} = this.props;
    const {filters = {},  items} = LIST[id] || {}
    const hasOpenedOrder = items && items.filter(item=> item.status === "ORDER_OPENED").length>0
    const tokenPair = filters.market;
    const { socket } = this.context;
    const reEmitPendingTransaction= () => {
      const owner = window.WALLET && window.WALLET.getAddress();
      const options = {
        owner
      };
      socket.emit('pendingTx_req', JSON.stringify(options))
    };

    const updateOrders = () =>{
      dispatch({
        type: 'orders/filtersChange',
        payload: {
          id: 'orders/trade',
        }
      })
      dispatch({
        type: 'orders/filtersChange',
        payload: {
          id: 'orders/wallet',
        }
      })
    }

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
      if(state && state.account && state.account.walletType === 'Address') {
        this.props.dispatch({
          type:'modals/modalChange',
          payload:{
            id:'wallet/watchOnlyToUnlock',
            originalData:{},
            pageFrom:'',
            visible:true
          }
        });
        return
      }
      Modal.confirm({
        title:intl.get('order.confirm_cancel_all', {pair: tokenPair || ''}),
        okText: intl.get('global.yes'),
        cancelText: intl.get('global.cancel'),
        onOk : async () => {
          const timestamp = Math.ceil(moment().valueOf()/ 1e3).toString();
          const type = tokenPair ?  4 : 2;
          const res = await window.WALLET.signMessage(sha3(timestamp));
          const params = {type};
          if(!res.error){
            params.sign = {...res,owner:window.WALLET.getAddress(),timestamp}
          }
          if(tokenPair){
            const mtokens = tokenPair.split('-')
            params.tokenS  =config.getTokenBySymbol(mtokens[0]).address
            params.tokenB  =config.getTokenBySymbol(mtokens[1]).address;
          }
          flexCancelOrder({...params}).then(resp => {
            if(!resp.error){
              Notification.open({
                message: intl.get('order.cancel_all_success', {pair: tokenPair}),
                type: "success"
              });
              updateOrders()
            }else{
              Notification.open({
                message: intl.get('order.cancel_all_failed', {pair: tokenPair}),
                type: "error",
                description: resp.error.message
              })
            }
          })
        },
        onCancel() {

        },
      })
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

export default connect()(ListActionsBar)
