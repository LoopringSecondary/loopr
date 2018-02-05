import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import model from './ListModel'
const namespace =  model.namespace
let keys = [...Object.keys(model.effects)]
keys = keys.map(key=>key.replace(`${namespace}/`,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

class ListContainer extends React.PureComponent {
  constructor(props) {
    super(props); 
    const { dispatch } = props
    this.actions = bindActionCreators(actionCreators,dispatch)
  }
  componentDidMount() {
    this.init();
  }
  init(){
    const { filters,page,sort,originQuery,defaultState } = this.props;
    this.actions.fetch({filters,page,sort,originQuery,defaultState});
  }
  render() {
    const { children,LIST,...rest} = this.props
    const childProps = {
      ...rest,
      [namespace]:{
        ...LIST,
        ...this.actions,
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
    );
  }
}
export default connect(({[namespace]:LIST})=>({LIST}))(ListContainer)

