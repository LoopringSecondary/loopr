import React from 'react'
import PropTypes from 'prop-types';
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }
  connect(url){
    let options = {
      transports: ['websocket']
    }
    const socket = io(url,options)
    return new Promise((resolve)=>{
      socket.on('connect',()=>{
        console.log('socket connect success!')
        resolve(socket)
      })
    })
  }
  constructor(props, context) {
    super(props, context)
    let options = {
      transports: ['websocket']
    }
    this.socket = io(props.url,options)
    this.socket.on('connect', (data) => {
      console.log('socket connected success!')
      window.SOCKET = this.socket
    })
    this.socket.on('disconnect', (data) => {
      console.log('socket disconnect')
    });
    this.socket.on('error', (err) => {
      console.log('socket error',err)
    });
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

SocketProvider.childContextTypes = {
  socket: PropTypes.object
}
export default SocketProvider
