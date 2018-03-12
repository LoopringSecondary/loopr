import React from 'react'
import PropTypes from 'prop-types';
class TickerSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tickersByPair:{}
    }
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.pair !== this.props.pair){
      const { socket } = this.context
      const options = {
        "contractVersion" : "v1.0",
        "market":nextProps.pair,
      }
      console.log('will update options',options)
      socket.emit('tickers_req',JSON.stringify(options))
    }
    return true
  }
  componentDidMount() {
    const { socket } = this.context
    const { pair } = this.props
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const options = {
      "contractVersion" : "v1.0",
      "market":pair,
    }
    console.log('did mount options',options)
    socket.emit('tickers_req',JSON.stringify(options))
    socket.on('tickers_res', (res)=>{
      console.log('ticker_res')
      res = JSON.parse(res)
      this.setState({
        tickersByPair:res
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
    console.log('ticker_res unmount')
    socket.off('tickers_res')
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
TickerSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TickerSocketContainer
