import React from 'react'
import PropTypes from 'prop-types'
import balancesData from './balances.json'

class TokensSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      socketTokens:[],
      socketToken:{},
    }
  }
  getTokenBySymbol(tokens){
    const { symbol } = this.props
    let socketToken = {}
    if(symbol){
      socketToken = tokens.find(token=>token.symbol === symbol)
    }
    return socketToken
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.on('balance_res', (res)=>{
      console.log('balance_res',res)
      const socketToken = this.getTokenBySymbol(res.tokens)
      this.setState({
        socketTokens:res.tokens,
        socketToken,
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.emit('balance_end')
    // socket.off(event)
  }
  render() {
    const childProps = {
     ...this.props,
     ...this.state,
     // socketTokens:balancesData, // for mock data
     // socketToken:this.getTokenBySymbol(balancesData) // for mock data
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
TokensSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TokensSocketContainer
