import React from 'react'
import PropTypes from 'prop-types';

class SocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { socket } = this.context
    const props = {
      socket
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
SocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default SocketContainer
