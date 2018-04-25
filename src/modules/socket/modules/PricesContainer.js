import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import pricesData from '../mocks/prices.json'

class PricesContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      prices: [],
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.currency !== this.props.currency) {
      const {socket} = this.context
      const options = {
        "currency": nextProps.currency,
      }
      socket.emit('marketcap_req', JSON.stringify(options))
    }
    return true // to make sure the parent container's render
  }

  getPrice(tokens) {
    const {symbol} = this.props
    let price = 0
    if (symbol) {
      const token = tokens.find(token => token.symbol === symbol)
      price = token && token.price
    }
    return price
  }

  componentDidMount() {
    const {socket} = this.context;
    if (socket) {
      const _this = this;
      const options = {
        "currency": this.props.currency,
      };
      socket.emit('marketcap_req', JSON.stringify(options))
      socket.on('marketcap_res', (res) => {
        console.log('marketcap_res');
        res = JSON.parse(res);
        if (!res.error && res.data && res.data.tokens) {
          _this.setState({
            prices: res.data.tokens,
          })
        }
      })
    }
    if (!socket) {
      console.log('socket not connected')
      // this.setState({
      //   prices:pricesData,
      // })
    }

  }

  componentWillUnmount() {
    const {socket} = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.off('marketcap_res')
  }

  getTokenBySymbol(symbol, ifFormat) {
    let priceToken = this.state.prices.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
    if (ifFormat) {
      if (priceToken) {
        const price = Number(priceToken.price)
        // fix bug: price == string
        if (price && typeof price === 'number') {
          priceToken.price = price
        } else {
          priceToken.price = 0
        }
        return {...priceToken}
      } else {
        return {
          price: 0,
        }
      }
    } else {
      return {...priceToken}
    }
  }

  getPriceByToken(tokenx, tokeny) {
    const market = window.CONFIG.getMarketBySymbol(tokenx, tokeny);
    const pricex = this.getTokenBySymbol(tokenx,true);
    const pricey = this.getTokenBySymbol(tokeny,true);
    if (market) {
      if (market.tokenx.toLowerCase() === tokenx.toLowerCase()) {
      return  pricex && pricey ? (pricex / pricey).toFixed(market.pricePrecision):0
      }else{
       return pricex && pricey ? (pricey / pricex).toFixed(market.pricePrecision):0
      }
    }
    return  0

  };


  getPriceByMarket(market){
    const tokenArray = market.split('-');
    const tokenx = tokenArray[0];
    const tokeny = tokenArray[0];
    return this.getPriceByToken(tokenx,tokeny)
  }


  render() {
    const {children, ...rest} = this.props
    const childProps = {
      ...rest,
      prices: {
        items: this.state.prices,
        getTokenBySymbol: this.getTokenBySymbol.bind(this),
        getPriceByToken:this.getPriceByToken.bind(this),
        getPriceByMarket:this.getPriceByMarket.bind(this)
      }
    };
    const {render} = this.props;
    if (render) {
      return render.call(this, childProps)
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

PricesContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default connect(({settings}) => ({currency: settings.preference.currency}))(PricesContainer)
