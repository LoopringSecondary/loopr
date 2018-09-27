import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TickersByLooopringData from '../mocks/TickersByLoopring.json'
import config from '../../../common/config'
import storage from '../../storage/'

class TickersSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tickersOfSource:[],
      //tickersOrigin:[],
      favors:{},
      filters:{},
    }
  }
  responseHandler(res){
    console.log('tickersOfSource_res')
    if(!res) return null
    res = JSON.parse(res)
    if(!res.error && res.data){
      this.setState({
        tickersOfSource:res.data,
      })

      const marketR = {}
      const markets = res.data.map(item=>{
        const m = item.market.split("-")
        marketR[m[1]] = true
        return {
          "tokenx": m[0],
          "tokeny": m[1],
          "market": item.market,
          "pricePrecision": item.decimals || 8
        }
      })
      storage.settings.setMarketPairs(markets)
      storage.settings.setMarketR(Object.keys(marketR))
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if(socket){
      socket.emit('tickersOfSource_req',`{"tickerSource":"coinmarketcap", "mode":"rank"}`,this.responseHandler.bind(this))
      socket.on('tickersOfSource_res',this.responseHandler.bind(this))
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
    socket.off('tickersOfSource_res')
  }
  getTickerByMarket(market){
    const ticker = this.state.tickersOfSource.find(item => item.market.toLowerCase() === market.toLowerCase() )
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
      tickersOfSource:{
        items:this.state.tickersOfSource,
        // originItems:this.state.tickersOrigin,
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
