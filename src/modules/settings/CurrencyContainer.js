import React from 'react'
import {connect} from 'react-redux'
class CurrencyContainer extends React.Component {
  shouldComponentUpdate(nextProps){
    return nextProps.currency !== this.props.currency;
  }
  render() {
    let currency = {};
    if(this.props.currency === 'USD'){
        currency = {
          symbol:'USD',
          icon:'$',
          title:'Dollar',
        };
        return '$'
    }else{
      currency = {
        symbol:'CNY',
        icon:'￥',
        title:'Yuan',
      };
      return <span style={{marginRight:"-2px"}}>￥</span>
    }
  }
}

export default connect(({settings})=>({currency:settings.preference.currency}))(CurrencyContainer)
