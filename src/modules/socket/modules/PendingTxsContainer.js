import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import config from '../../../common/config'
import {toBig, toNumber} from "Loopring/common/formatter";

function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
}
class PendingTxsContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pendingTxs: [],
    }
  }
  responseHandler(res){
    console.log('pendingTxs_res')
    if(!res) return null
    res = JSON.parse(res)
    if (!res.error && res.data && isArray(res.data)) {
      this.setState({
        pendingTxs: res.data,
      })
    }
  }
  componentDidMount() {
    const {socket} = this.context
    if (socket) {
      const _this = this
      const owner = window.WALLET && window.WALLET.getAddress()
      const options = {
        owner
      };
      socket.emit('pendingTx_req', JSON.stringify(options),this.responseHandler.bind(this))
      socket.on('pendingTx_res',this.responseHandler.bind(this))
    }
    if (!socket) {
      console.log('socket not connected')
    }
  }

  componentWillUnmount() {
    const {socket} = this.context
    if (!socket) {
      console.log('socket connection has not been established');
      return false
    }
    socket.off('pendingTxs_res')
  }

  isOrderCanceling({validSince, tokenPair, orderHash}) {
    const txs = this.state.pendingTxs;
    const cancelAllTxs = txs.filter(tx => tx.type === 'cutoff');
    cancelAllTxs.sort(function (a, b) {
      return toNumber(b.value) - toNumber(a.value)
    });
    if (cancelAllTxs.length > 0 && validSince && toNumber(cancelAllTxs[0].value) > toNumber(validSince)) {
      return true;
    }

    if (tokenPair) {
      const cancelMarketTx = txs.find(tx => tx.type === 'cutoff_trading_pair' && tx.content.market.toLowerCase() === tokenPair.toLowerCase());
      if (cancelMarketTx) {
        return true
      }
    }

    if (orderHash) {
      const cancelOrderTx = txs.find(tx => tx.type === 'cancel_order' && tx.content.orderHash.toLowerCase() === orderHash.toLowerCase())
      return !!cancelOrderTx
    }
    return false;
  }

  isApproving(symbol) {
    if (symbol) {
      const txs = this.state.pendingTxs;
      const approveTxs = txs.filter(tx => tx.type === 'approve' && tx.symbol.toLowerCase() === symbol.toLowerCase());
      console.log('Approve TXs:',approveTxs);
      approveTxs.sort((a, b) => b.nonce - a.nonce);
      if (approveTxs.length > 0) {
        console.log('Approve Value:',approveTxs[0].value);
        return toBig(approveTxs[0].value);
      }
    }
  }

  isWithdrawOldWeth() {
    const txs = this.state.pendingTxs;
    const wethConfig = config.getTokenBySymbol('WETH_OLD');
    const withdrawTx = txs.find(tx => tx.protocol.toLowerCase() === wethConfig.address.toLowerCase() && toBig(tx.value).eq(0));
    return !!withdrawTx
  }

  isDepositWeth() {
    const txs = this.state.pendingTxs;
    const depositTxs = txs.filter(tx => tx.symbol.toLowerCase() === 'weth' && tx.type === 'convert_income');
    let totalValue = toBig(0);
    depositTxs.forEach(tx => totalValue = totalValue.plus(toBig(tx.value)));
    return totalValue;
  }

  render() {
    const {children, ...rest} = this.props;
    const childProps = {
      ...rest,
      txs: {
        items: this.state.pendingTxs,
        isOrderCanceling: this.isOrderCanceling.bind(this),
        isApproving: this.isApproving.bind(this),
        isWithdrawOldWeth: this.isWithdrawOldWeth.bind(this),
        isDepositWeth: this.isDepositWeth.bind(this)
      }
    }
    const {render} = this.props
    if (render) {
      return render.call(this, childProps)
    }
    return (
      <div>
        {
          React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {...childProps})
          })
        }
      </div>
    )
  }
}

PendingTxsContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default PendingTxsContainer
