import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const configTokens = window.CONFIG.getTokens()
const configSymbols = configTokens.map(item=>item.symbol)

class TradesContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      trades:[],
    }
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.market !== this.props.market){
      const { socket } = this.context
      const options = {
        "delegateAddress" :window.CONFIG.getDelegateAddress(),
        "side" :'sell',
        "market":nextProps.market,
      };
      socket.emit('trades_req',JSON.stringify(options),this.responseHandler.bind(this))
    }
    return true // to make sure the parent container's render
  }
  responseHandler(res){
    console.log('trades_res')
    if(!res) return null
    res = JSON.parse(res)
    if(!res.error && res.data ){
      this.setState({
        trades:res.data
      })
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      if(this.props.market){
        const options = {
          "delegateAddress" :window.CONFIG.getDelegateAddress(),
          "market":this.props.market,
          "side" :'sell',
        }
        socket.emit('trades_req',JSON.stringify(options),this.responseHandler.bind(this))
        socket.on('trades_res', this.responseHandler.bind(this))
      }
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
    socket.off('trades_res')
  }

  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      trades:this.state.trades
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
TradesContainer.contextTypes = {
  socket: PropTypes.object.isRequired
}
export default connect(({account})=>({address:account.address}))(TradesContainer)
