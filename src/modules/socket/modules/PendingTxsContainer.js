import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import pricesData from '../mocks/prices.json'

class PendingTxsContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pendingTxs:[],
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      const _this = this
      const owner = window.WALLET && window.WALLET.getAddress()
      const options = {
        owner
      }
      socket.emit('pendingTxs_req',JSON.stringify(options))
      socket.on('pendingTxs_res', (res)=>{
        console.log('pendingTxs_res')
        res = JSON.parse(res)
        if(!res.error){
          _this.setState({
            pendingTxs:res.data,
          })
        }
      })
    }
    if(!socket) {
      console.log('socket not connected')
    }
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off('pendingTxs_res')
  }
  getTokenBySymbol(symbol,ifFormat){
    // TODO
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      txs:{
        items:this.state.pendingTxs,
        getTokenBySymbol:this.getTokenBySymbol.bind(this)
      }
    }
    const {render} = this.props
    if(render){
      return render.call(this,childProps)
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
