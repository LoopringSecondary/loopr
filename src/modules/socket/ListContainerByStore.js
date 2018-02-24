import React from 'React'
import io from 'socket.io-client'
import { connect } from 'dva';
import { bindActionCreators } from 'redux';

const actionCreators = []

class ListContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.socket = io(props.url)
    this.actions = bindActionCreators(actionCreators,dispatch)
  }
  componentDidAmount(){
    let data = ''
    this.socket.emit('fetchItems',data)
    this.socket.on('fetchItemsSuccess',this.actions.fetchSuccess.bind(this,{items:[]}))
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

export default connect()(ListContainer)

