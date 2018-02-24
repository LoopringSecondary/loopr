import React from 'React'
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.socket = io(props.url)
    this.state = {
      
    }
  }
  componentDidAmount(){
    this.socket.on('eventName',)
  }
  updateItems(res){
    this.setState({
      items:
    })
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

export default SocketProvider
