import React, { Component } from 'react';
import { connect } from 'dva';

const globalContainer = ({ global={},children})=>{
  console.log('global',global)
  // window.socket =
  return (
    <div>
      {children}
    </div>
  )
}
export default connect(({global})=>({global}))(globalContainer)

