import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import model from './model'
const namespace =  model.namespace
let keys = Object.keys(model.reducers)
keys = keys.map(key=>key.replace(/settings\//,'')) // TO DO
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

const SettingsContainer = (props)=>{
  const { children,dispatch,settings,...rest } = props
  const actions = bindActionCreators(actionCreators,dispatch)
  const childProps = {
    ...rest,
    settings:{
      ...settings,
      ...actions,
    }
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

