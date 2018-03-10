import React from 'react'
import PropTypes from 'prop-types';
class TickersSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tickers:[]
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.emit('loopringTickers_req','')
    socket.on('loopringTickers_res', (res)=>{
      console.log('loopringTickers_res')
      this.setState({
        tickers:res.result,
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.emit('tickers_end')
    // socket.off(event)
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      ...this.state,
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
TickersSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TickersSocketContainer
