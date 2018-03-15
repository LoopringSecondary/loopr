import React from 'react'
import PropTypes from 'prop-types';
class TransactionsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items:[],
      filters:{},
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
    const query = {
      owner:'0x750aD4351bB728ceC7d639A9511F9D6488f1E259',
    }
    socket.emit('portfolio_req',JSON.stringify(query))
    socket.on('portfolio_res', (res)=>{
      console.log('portfolio_res',res)
      if(!res.error){
        this.setState({
          items:res.data,
        })
      }
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off('portfolio_res')
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      LIST:{
        ...this.state,
      }
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
