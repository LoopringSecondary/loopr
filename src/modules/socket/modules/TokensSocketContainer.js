import React from 'react'
import PropTypes from 'prop-types'
import balancesData from './balances.json'

class TokensSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tokens:[]
    }
  }

  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const getTokens = (res)=>{
      const balances = res.tokens
      return balances
    }
    socket.on('balance_res', (res)=>{
      console.log('balance_res',res)
      const tokens = getTokens(res)
      this.setState({
        tokens
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
    const getTokenBySymbol = (symbol)=>{
      return this.state.tokens.find(token=>token.symbol === symbol) || {}
    }
    const childProps = {
     ...this.props,
     ...this.state,
     tokens:balancesData, // for mock data
     getTokenBySymbol,
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
