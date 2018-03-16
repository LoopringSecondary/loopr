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
      symbol:'LRC',
      pageIndex:'1',
      pageSize:'20',
    }
    socket.emit('transaction_req',JSON.stringify(query))
    socket.on('transaction_res', (res)=>{
      res = JSON.parse(res)
      console.log('transaction_res',res)
      if(!res.error){
        this.setState({
          items:res.data.data,
        })
      }
    })
  }
  filtersChange({filters={},page={}}){
    this.setState({
      ...this.state,
      filters:{
        ...this.state.filters,
        ...filters,
      },
      page:{
        ...this.state.page,
        ...page
      }
    })
  }
  pageChange({page={}}){
    this.setState({
      ...this.state,
      page:{
        ...this.state.page,
        ...page
      }
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off('transaction_res')
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      LIST:{
        ...this.state,
      },
      actions:{
        filtersChange:this.filtersChange.bind(this),
        pageChange:this.pageChange.bind(this),
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
