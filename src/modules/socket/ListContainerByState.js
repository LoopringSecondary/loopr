import React from 'React'
import io from 'socket.io-client'

class ListContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.socket = io(props.url)
    this.state = {
      items:[]
    }
  }
  componentDidAmount(){
    let data = ''
    this.socket.emit('eventName',data)
    this.socket.on('eventName',this.updateItems)
  }
  updateItems(res){
    this.setState({
      items:res.items
    })
  }

  render() {
    const childProps = {
      items:this.state.items
    }
    <div>
      {
        React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {...childProps})
        })
      }
    </div>


  }
}

export default ListContainer

// return React.Children.only(this.props.children)
