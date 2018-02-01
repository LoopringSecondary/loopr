import React, { Component } from 'react';
import { connect } from 'dva';

const GlobalContainer = ({ global={},children})=>{
  return (
    <div>
      {children}
    </div>
  )
}
export default connect(({global})=>({global}))(GlobalContainer)

