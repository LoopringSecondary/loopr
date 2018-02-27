import React from 'react'
class SocketEventContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    const { event, handler } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.on(event, handler)
  }
  componentWillUnmount() {
    const { event, handler } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off(event, handler)
  }
  render() {
    return false
  }
}
export default SocketEventContainer
