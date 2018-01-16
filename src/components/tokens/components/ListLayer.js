import React, { PropTypes } from 'react';
import {  Popconfirm, Pagination,Dropdown,Popover,Button,Icon,Menu,Modal,Checkbox,Badge} from 'antd';
import TransferForm from './TransferForm'
import Receive from './Receive'
function Approve(props){
	return <div>Approve TODO</div>
}
function Convert(props){
	return <div>Convert TODO</div>
}
function ListLayer({ actions={},LIST={},configs={},children}){
  let {
    filters={},
    columns=[],
    page={},
    sort={},
    layer={},
  } = LIST;
  let showLayer = type => {
    actions.layerChange({
      [type]:{
        visible:true,
      }
    })
  }
  let hideLayer = type => {
    actions.layerChange({
      [type]:{
        visible:false,
      }
    })
  }
  const getModalProps = type => {
    let thisLayer = layer[type] || {};
    return {
      visible:thisLayer.visible,
      // title:thisLayer.title
      footer:null,
      closable:false,
      maskClosable:true,
      wrapClassName:"rs",
      onCancel:hideLayer.bind(this,type),
    }
  }

  let _this = this;
  return (
    <div>
      <Modal {...getModalProps('transfer')} title="Transfer"  >
        <TransferForm LIST={LIST} actions={actions} />
      </Modal>
      <Modal {...getModalProps('receive')} title="My Ethereum Address"  >
        <Receive />
      </Modal>
      <Modal {...getModalProps('approve')} title="Approve"  >
        <Approve />
      </Modal>
      <Modal {...getModalProps('convert')} title="Convert"  >
        <Approve />
      </Modal>
    </div>
  );
}

export default ListLayer;
