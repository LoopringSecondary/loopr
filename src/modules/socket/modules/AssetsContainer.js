import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const configTokens = window.CONFIG.getTokens()
const configSymbols = configTokens.map(item=>item.symbol)

class AssetsContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      assets:[],
    }
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.address !== this.props.address){
      const { socket } = this.context
      const options = {
        "delegateAddress" :window.CONFIG.getDelegateAddress(),
        "owner":nextProps.address,
      };
      socket.emit('balance_req',JSON.stringify(options),this.responseHandler.bind(this))
    }
    return true // to make sure the parent container's render
  }
  responseHandler(res){
    console.log('balance_res')
    res = JSON.parse(res)
    if(!res.error && res.data && res.data.tokens){
      this.setState({
        // get intersection of server config & client config
        assets:res.data.tokens.filter(token=>configSymbols.includes(token.symbol))
      })
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      if(this.props.address){ // fix bug: trade page not unclock wallet
        const options = {
          "delegateAddress" :window.CONFIG.getDelegateAddress(),
          "owner":this.props.address,
        }
        socket.emit('balance_req',JSON.stringify(options),this.responseHandler.bind(this))
        socket.on('balance_res', this.responseHandler.bind(this))
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
    // console.log('AssetsContainer unmount')
    // socket.off('balance_res')
  }
  getTokenBySymbol(symbol,ifFormat){
    let assetToken = this.state.assets.find(item => item.symbol.toLowerCase() === symbol.toLowerCase() ) || {balance:0, allowance:0}
    if(ifFormat){
      if(assetToken){
        const balance =  Number(assetToken.balance)
        const allowance =  Number(assetToken.allowance)
        // fix bug: balance == string
        if(balance && typeof balance === 'number'){
          assetToken.balance = balance
        }else{
           assetToken.balance = 0
        }
        if(allowance && typeof allowance === 'number'){
          assetToken.allowance = allowance
        }else{
           assetToken.allowance = 0
        }
        return {...assetToken}
      }else{
        return {
          balance:0,
          allowance:0,
        }
      }
    }else{
      return {...assetToken}
    }
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      assets:{
        items:this.state.assets,
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
AssetsContainer.contextTypes = {
  socket: PropTypes.object.isRequired
}
export default connect(({account})=>({address:account.address}))(AssetsContainer)
