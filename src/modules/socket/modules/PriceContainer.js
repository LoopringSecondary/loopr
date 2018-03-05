import React from 'react'
import PropTypes from 'prop-types';
import pricesData from './prices.json'
class PriceSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      price:0,
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const { symbol } = this.props
    if(!symbol){
      throw new Error('symbol props is required')
    }
    socket.on('marketcap_res', (res)=>{
      const token = res.tokens.find(token=>token.token === symbol)
      const price = token && token .price
      this.setState({
        price:price
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.emit('marketcap_end')
    // socket.off(event)
  }
  render() {
    const symbol = this.props.symbol
    const token = pricesData.find(token=>token.token === symbol) // For Mock Price data
    const price = token && token .price // For Mock Price data
    const childProps = {
      ...this.props,
      ...this.state,
      price, // For Mock Price data
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
PriceSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default PriceSocketContainer
