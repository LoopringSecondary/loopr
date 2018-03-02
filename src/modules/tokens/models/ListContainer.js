import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import model from './ListModel'
const namespace =  model.namespace
let keys = Object.keys(model.reducers)
keys = keys.map(key=>key.replace(`${namespace}/`,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);
const ListContainer = (props)=>{
  const { children,dispatch,LIST,...rest} = props
  const actions = bindActionCreators(actionCreators,dispatch)
  const childProps = {
    ...rest,
    LIST:{
      ...LIST,
    },
    actions:{
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

export default connect(({[namespace]:LIST})=>({LIST}))(ListContainer)

