import React from 'react'
import PropTypes from 'prop-types';
class SocketEventContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      res:null
    }
  }
  componentDidMount() {
    const { event } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.on(event, (res)=>{
      this.setState({
        res:res
      })
    })
  }
  componentWillUnmount() {
    const { event } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off(event)
  }
  render() {
    const props = {
     res:this.state.res
    }
    return (
      <div>
        {
          React.Children.map(children, child => {
              return React.cloneElement(child, {...props})
          })
        }
      </div>
    )

  }
}
SocketEventContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default SocketEventContainer
