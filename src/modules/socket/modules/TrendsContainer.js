import React from 'react'
import PropTypes from 'prop-types';
class TrendsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      trends:[]
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const currency = window.STORAGE.settings.getCurrency() || 'CNY' // TODO
    const data = {currency}
    socket.on('trends_res', (res)=>{
      if(!res) return null
      this.setState({
        trends:res.result,
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.off(event)
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      ...this.state,
    }
    const {render} = this.props
    if(render){
      return render.call(this,childProps)
    }
    return (
      <div>
         {
           React.Children.map(this.props.children, child => {
               return React.cloneElement(child, {...childProps})
           })
         }
      </div>
    )
  }
}
TrendsSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TrendsSocketContainer
