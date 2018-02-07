import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import model from './model'
const namespace =  model.namespace;
let keys = Object.keys(model.reducers);
const effectKeys = Object.keys(model.effects);
keys = keys.concat(effectKeys);
keys = keys.map(key=>key.replace(/account\//,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

const AccountContainer = (props)=>{
  const { children,dispatch,account,...rest} = props
  const actions = bindActionCreators(actionCreators,dispatch)
  const childProps = {
    ...rest,
    account:{
      ...account,
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

export default connect(({account})=>({account}))(AccountContainer)

