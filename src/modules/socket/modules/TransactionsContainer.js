import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import model from '../../transactions/models/list'
const namespace =  model.namespace
let keys = [ ...Object.keys(model.reducers),...Object.keys(model.effects) ]
keys = keys.map(key=>key.replace(`${namespace}/`,''))
const actionCreators = window.REDUX.getActionCreators(namespace,keys);

class TransactionsContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { dispatch } = props
    this.actions = bindActionCreators(actionCreators,dispatch)
  }
  componentDidMount() {
    const { socket } = this.context
    const { LIST } = this.props
    const { filters={},page,} = LIST
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    const owner = window.WALLET && window.WALLET.getAddress()
    const query = {
      owner,
      symbol:filters.token,
      status:filters.status,
      txType:filters.txType,
      pageIndex:page.current,
      pageSize:page.size || 10,
    }
    socket.emit('transaction_req',JSON.stringify(query))
    socket.on('transaction_res', (res)=>{
      res = JSON.parse(res)
      console.log('transaction_res',res)
      if(!res.error && res.data ){
        this.actions.itemsChange({
          items:res.data.data,
          page:{
            total:res.data.total,
            current:res.data.pageIndex,
            size:res.data.pageSize,
          }
        })
      }else{
        this.actions.itemsChange({
          items:[],
          page:{
          }
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
    // socket.off('transaction_res')
  }
  render() {
    const { children,...rest } = this.props
    const childProps = {
      ...rest,
      actions:{
        ...this.actions,
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
TransactionsContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default connect(({[namespace]:LIST})=>({LIST}))(TransactionsContainer)
