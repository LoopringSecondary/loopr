import React from 'React'
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }
  constructor(props, context) {
    super(props, context)
    this.socket = io(props.url))
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

export default SocketProvider
