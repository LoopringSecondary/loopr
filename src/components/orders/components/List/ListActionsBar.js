import React from 'react';
import {connect} from 'dva'
import ListFiltersForm from './ListFiltersForm'
import {Button,Modal} from 'antd'
import {cancelOrdersByTokenPairs,cancelAllOrders} from 'Loopring/relay/order';



 function ListActionsBar(props){

 const {actions={},LIST={},className} = props;
 const {filters={}} = LIST
  const cancelAllOrders = ()=>{
    Modal.confirm({
        title: 'Do you Want to cancel all orders?',
        content: 'Some descriptions',
        onOk:()=>{

        },
        onCancel:()=>{},
        okText:'Yes',
        cancelText:'No',
    })
  }
  return (
    <div className={className}>
        <div className="row ml0 mr0 align-items-center">
            <div className="col-auto">
                <ListFiltersForm actions={actions} LIST={LIST} />
            </div>
            <div className="col">

            </div>
            <div className="col-auto">
                <Button type="primary" onClick={cancelAllOrders}>Cancel All</Button>
            </div>
        </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    privateKey: state.account.privateKey,
    gasPrice: state.settings.trading.gasPrice
  };
}

export default connect(mapStateToProps)(ListActionsBar)
