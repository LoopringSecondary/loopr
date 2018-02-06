import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import model from './PlaceOrderModel'
const namespace =  model.namespace
let keys = Object.keys(model.reducers)
keys = keys.map(key=>key.replace(`${namespace}/`,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

@connect(
  ({placeOrder})=>({placeOrder})
)
export default class Container extends React.Component {
  render() {
    const { children,dispatch,placeOrder,id,...rest} = this.props
    let data = placeOrder[id] || {}
    const actions = bindActionCreators(actionCreators,dispatch)
    const childProps = {
      ...rest,
      placeOrder:{
        ...data,
        ...actions,
      }
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
