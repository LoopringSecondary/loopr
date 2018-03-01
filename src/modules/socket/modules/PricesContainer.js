import React from 'react'
import PropTypes from 'prop-types';

class PricesSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      prices:[],
      symbol:'CNY',
      icon:'￥',
    }
  }
  componentDidMount() {
    const { symbol } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const data = {
      symbol:symbol || "CNY",
    }
    socket.emit('marketcap_req',data)
    socket.on('marketcap_res', (res)=>{
      this.setState({
        prices:res.tokens,
        symbol:res.currency,
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

    const childProps = {
      ...this.props,
      ...this.state
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
PricesSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default PricesSocketContainer
