import React from 'react'
import PropTypes from 'prop-types'
import balancesData from './balances.json'
class BalanceSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      balance:0
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const {symbol}= this.props
    if(!symbol){
      throw new Error('symbol props is required')
    }
    socket.on('balance_res', (res)=>{
      console.log('balance_res',res)
      const token = res.tokens.find(token=>token.token === symbol)
      const balance = token && token.balance
      this.setState({
        balance
      })
      window.STORAGE.balances.setBalances(res.tokens)
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
    const symbol = this.props.symbol
    const token = balancesData.find(token=>token.token === symbol) // for mock balance data
    const balance = token && token.balance // for mock balance data
    const childProps = {
     ...this.props,
     ...this.state,
     balance, // for mock balance data
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
BalanceSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default BalanceSocketContainer
