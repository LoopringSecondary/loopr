import React, { Component } from 'react';
import { connect } from 'dva';

const GlobalProvider = (props)=>{
	console.log('gloabal container re-render',props)
	const { children } = props
  return (
    <div>
      {
        React.Children.map(children, child => {
            return React.cloneElement(child, {...props})
        })
      }

    </div>
  )
}
export default connect(({global})=>({global}))(GlobalProvider)

