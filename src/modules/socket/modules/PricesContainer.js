import React from 'react'
import PropTypes from 'prop-types';
import pricesData from './prices.json'
class PriceSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      price:0,
      prices:[],
    }
  }
  getPrice(tokens){
    const { symbol } = this.props
    let price = 0
    if(symbol){
      const token = tokens.find(token=>token.symbol === symbol)
      price = token && token.price
    }
    return price
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const _this = this
    socket.on('marketcap_res', (res)=>{
      console.log('marketcap_res')
      res = JSON.parse(res)
      const price = _this.getPrice(res.tokens)
      this.setState({
        price,
        prices:res.tokens,
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
    console.log('price unmount')
    socket.off('marketcap_res')
  }
  render() {
    const childProps = {
      ...this.props,
      ...this.state,
      // price:this.getPrice(pricesData), // For Mock Price data
      // prices:pricesData,// For Mock Price data
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
