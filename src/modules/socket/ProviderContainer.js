import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketProvider from './Provider';

const SocketProviderContainer = (props)=>{
  const { settings } = props
  const url = settings.relay.selected || 'https://relay1.loopring.io/ws'
  return (
      <SocketProvider url={url}>
        {props.children}
      </SocketProvider>
  )
}
export default connect(({settings})=>({settings}))(SocketProviderContainer)

