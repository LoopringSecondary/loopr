import React from 'react'
import PropTypes from 'prop-types';
class TransactionsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      transactions:[]
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
    socket.on('transactions_res', (res)=>{
      this.setState({
        transactions:res.result,
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    // socket.emit('transactions_end')
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
TransactionsSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TransactionsSocketContainer
