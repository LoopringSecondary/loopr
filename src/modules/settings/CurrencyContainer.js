import React from 'react'
import {connect} from 'react-redux'
class CurrencyContainer extends React.Component {
  shouldComponentUpdate(nextProps){
    if(nextProps.currency !== this.props.currency){
      return true
    }else{
      return false
    }
  }
  render() {
    console.log('CurrenryContainer render')
    let currency = {}
    if(this.props.currency === 'USD'){
        currency = {
          symbol:'USD',
          icon:'$',
          title:'Dollar',
        }
        return '$'
    }else{
      currency = {
        symbol:'CNY',
        icon:'￥',
        title:'Yuan',
      }
      return '￥'
    }
  }
}

export default connect(({settings})=>({currency:settings.preference.currency}))(CurrencyContainer)
