import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux'

const Setting = ({ history,settings,children})=>{
  let childProps = {settings}
  console.log(childProps)
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
export default connect(({settings})=>({settings}))(Setting)
