import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketProvider from './Provider';


const SocketProviderContainer = (props)=>{
  const { settings } = props
  const host = settings.relay.selected || 'https://relay1.loopring.io'
  const url = `http://13.112.62.24`
  return (
      <SocketProvider url={url}>
        {props.children}
      </SocketProvider>
  )
}
export default connect(({settings})=>({settings}))(SocketProviderContainer)

