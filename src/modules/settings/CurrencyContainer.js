import React from 'react'
import {connect} from 'react-redux'
class CurrencyContainer extends React.Component {
  render() {
    let currency = {}
    if(this.props.currency === 'USD'){
        currency = {
          symbol:'USD',
          icon:'$',
          title:'Dollar',
        }
    }else{
      currency = {
        symbol:'CNY',
        icon:'￥',
        title:'Yuan',
      }
    }
    const childProps = {
      ...this.props,
      currency,
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

export default connect(({settings})=>({currency:settings.preference.currency}))(CurrencyContainer)
