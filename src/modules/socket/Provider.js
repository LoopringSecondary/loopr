import React from 'react'
import PropTypes from 'prop-types';
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }
  constructor(props, context) {
    super(props, context)
    this.socket = io.connect(props.url)
    console.log('this.socket',this.socket)
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

SocketProvider.childContextTypes = {
  socket: PropTypes.object
}


export default SocketProvider
