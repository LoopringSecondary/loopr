import React, { Component } from 'react';
import { connect } from 'dva';

const GlobalContainer = (props)=>{
	const { children,dispatch } = props
  
  return (
    <div>

    </div>
  )
}
export default connect(({global})=>({global}))(GlobalContainer)

