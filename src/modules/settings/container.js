import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import model from './model'
const namespace =  model.namespace
let keys = Object.keys(model.reducers)
keys = keys.map(key=>key.replace(`${namespace}/`,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

const SettingsContainer = (props)=>{
  const { children,dispatch,settings,...rest } = props
  const actions = bindActionCreators(actionCreators,dispatch)
  const childProps = {
    ...rest,
    settings:{
      ...settings,
      ...actions,
    },
    dispatch
  }
  return (
    <div>
      {
        React.Children.map(children, child => {
          return React.cloneElement(child, {...childProps})
        })
      }
    </div>
  )
}

export default connect(({settings})=>({settings}))(SettingsContainer)

