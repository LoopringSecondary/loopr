import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TickersByLooopringData from '../mocks/TickersByLoopring.json'
class TickersSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tickersByLoopring:[],
      favors:{},
      fitlers:{},
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      socket.emit('loopringTickers_req','')
      socket.on('loopringTickers_res', (res)=>{
        console.log('loopringTickers_res')
        res = JSON.parse(res)
        if(!res.error && res.data){
          this.setState({
            tickersByLoopring:res.data,
          })
        }
      })
    }
    if (!socket) {
      console.log('socket not connected')
    }
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket not connected')
      return false
    }
    socket.off('loopringTickers_res')
  }
  getTickerBySymbol(symbol){
    return this.state.tickersByLoopring.find(item => item.symbol.toLowerCase() === symbol.toLowerCase() )
  }
  getTickerByMarket(market){
    return this.state.tickersByLoopring.find(item => item.market.toLowerCase() === market.toLowerCase() )
  }
  toggleFavor(market){
    this.setState({
      favors:{
        ...this.state.favors,
        [market]:!this.state.favors[market],
      }
    })
    window.STORAGE.markets.toggleFavor(market)
  }

  filtersChange({filters={}})  {
    this.setState({
      ...this.state,
      filters,
    })
  }
  render() {
    const {children,...rest} = this.props
    const { socket } = this.context
    const childProps = {
      ...rest,
      tickersByLoopring:{
        items:this.state.tickersByLoopring,
        filters:this.state.filters,
        getTickerBySymbol:this.getTickerBySymbol.bind(this),
        filtersChange:this.filtersChange.bind(this),
        getTickerByMarket:this.getTickerByMarket.bind(this),
        toggleFavor:this.toggleFavor.bind(this),
      }
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
export default connect()(TickersSocketContainer)
