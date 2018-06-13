import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TickersByLooopringData from '../mocks/TickersByLoopring.json'
import config from '../../../common/config'

class TickersSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tickersByLoopring:[],
      tickersOrigin:[],
      favors:{},
      fitlers:{},
    }
  }
  responseHandler(res){
    console.log('loopringTickers_res')
    if(!res) return null
    res = JSON.parse(res)
    if(!res.error && res.data){
      // filter support market
      const supportMarket = res.data.filter(item=>{
        return config.isSupportedMarket(item.market)
      })
      this.setState({
        tickersByLoopring:supportMarket || [],
        tickersOrigin:res.data,
      })
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      socket.emit('loopringTickers_req','',this.responseHandler.bind(this))
      socket.on('loopringTickers_res',this.responseHandler.bind(this))
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
  getTickerByMarket(market){
    const ticker = this.state.tickersByLoopring.find(item => item.market.toLowerCase() === market.toLowerCase() )
    if(ticker){
      return {...ticker}
    }else{
      return null
    }
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
        originItems:this.state.tickersOrigin,
        filters:this.state.filters,
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
