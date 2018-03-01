import React from 'react'
import PropTypes from 'prop-types';

class PricesSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      prices:[],
      currency:{
        symbol:'CNY',
        icon:'￥',
      }

    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const currency = window.STORAGE.settings.getCurrency() || 'CNY' // TODO
    const data = {currency}
    socket.emit('marketcap_req',data)
    socket.on('marketcap_res', (res)=>{
      this.setState({
        prices:res.tokens,
        currency:{
          name:res.currency,
          icon:res.currency === 'CNY' ? '￥':'$',
        }
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
