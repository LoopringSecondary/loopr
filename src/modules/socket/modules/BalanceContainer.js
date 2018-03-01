import React from 'react'
import PropTypes from 'prop-types';
class SocketEventContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      balances:[]
    }
  }
  componentDidMount() {
    const { event } = this.props
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const data = {
      owner:'0xd02323de710729f065a4defbda0c6148c6bac649',
      contractVersion:'v1.0'
    }
    socket.emit('balance_req',data)
    socket.on('balance_res', (res)=>{
      console.log('balance_res',res)
      this.setState({
        balances:res.tokens
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
    // socket.emit('balance_end')
    // socket.off(event)
  }
  render() {
    const childProps = {
     res:this.state.res
    }
    return (
      <div>
        {
          React.Children.map(children, child => {
              return React.cloneElement(child, {...childProps})
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
