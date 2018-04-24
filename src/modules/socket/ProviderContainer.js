import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketProvider from './Provider';


const SocketProviderContainer = (props)=>{
  // const { host } = props
  const host = window.STORAGE.settings.getRelay()
  return (
      <SocketProvider url={host}>
        {props.children}
      </SocketProvider>
  )
}
export default connect(({settings})=>({host:settings.relay.selected}))(SocketProviderContainer)

