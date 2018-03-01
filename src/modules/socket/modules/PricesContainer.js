import React from 'react'
import PropTypes from 'prop-types';

class PricesSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      prices:[],
      currenry:'CNY',
    }
  }
  componentDidMount() {
    const { symbol,currency } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const data = {
      currency:currency || "CNY", // CNY / USD
    }
    socket.emit('marketcap_req',data)
    socket.on('marketcap_res', (res)=>{
      this.setState({
        prices:res.tokens,
        currency:res.currency,
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
      ...this.state
    }
    // if(Children){
    //   return <Children {...childProps}/>
    // }
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
