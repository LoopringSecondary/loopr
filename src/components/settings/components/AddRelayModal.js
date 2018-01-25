import React from 'react';
import {connect} from 'dva';
import { Modal} from 'antd';
import AddRelay from './AddRelay';

const AddRelayModal = (props) => {
  const { modals,dispatch } = props
  const id='addRelay'
  let thisModal = modals[id] || {}
  const hideModal = (payload)=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:id,
        visible:false,
      }
    })
  }
  const modalProps = {
    visible:thisModal.visible,
    title:thisModal.title || 'Add Relay',
    footer:null,
    closable:true,
    maskClosable:true,
    wrapClassName:"rs",
    onCancel:hideModal,
  } 
  return (
    <Modal {...modalProps}>
      <AddRelay />
    </Modal>
  );
};

export default connect(({modals})=>({modals}))(AddRelayModal);


