import React from 'react'
import PropTypes from 'prop-types';
class TransactionsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items:[],
      filters:{},
      loading:false,
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const owner = window.WALLET && window.WALLET.getAddress()
    const query = {
      owner,
      symbol:'LRC',
      pageIndex:'1',
      pageSize:'20',
    }
    socket.emit('transaction_req',JSON.stringify(query))
    socket.on('transaction_res', (res)=>{
      console.log('transaction_res',res)
      if(!res) return null
      res = JSON.parse(res)
      if(!res.error){
        this.setState({
          items:res.data.data,
          loading:false,
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
      },
      loading:true,
    })
  }
  pageChange({page={}}){
    this.setState({
      ...this.state,
      page:{
        ...this.state.page,
        ...page
      },
      loading:true,
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
