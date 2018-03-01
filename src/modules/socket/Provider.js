import React from 'react'
import PropTypes from 'prop-types';
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }
  async connect(url){
    const socket = io(url)
    return new Promise((resolve)=>{
      socket.on('connect',()=>{
        console.log('socket connect success!')
        resolve(socket)
      })
    })
  }
  constructor(props, context) {
    super(props, context)
    const options = {
      path:'/'
    }
    this.socket = io(props.url,options)
    this.socket.on('connect', (data) => {
      console.log('socket connected success!',this.socket)
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
