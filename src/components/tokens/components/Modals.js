import React, { PropTypes } from 'react';
import { Modal,Divider} from 'antd';
import Transfer from './Transfer'
import TransferPreview from './TransferPreview'
import Receive from './Receive'
import Convert from './Convert'
import Approve from './Approve'


function Modals({ modal={},children}){


  const getModalProps = type => {
    let thisLayer = modal[type] || {}
    return {
      visible:thisLayer.visible,
      // title:thisLayer.title
      footer:null,
      closable:true,
      maskClosable:true,
      wrapClassName:"rs",
      onCancel:modal.hideModal.bind(this,type),
    }
  }
  let _this = this;
  return (
    <div>
      <Modal {...getModalProps('transfer')} title="Send LRC"  >
        <Transfer modal={modal} />
      </Modal>
      <Modal {...getModalProps('receive')} title="My Ethereum Address"  >
        <Receive modal={modal} />
      </Modal>
      <Modal {...getModalProps('approve')} title="Approve"  >
        <Approve modal={modal} />
      </Modal>
      <Modal {...getModalProps('convert')} title="Convert"  >
        <Convert modal={modal} />
      </Modal>
      <Modal {...getModalProps('transfer/preview')} width="50%" style={{maxWidth:'100%',width:'60%'}} title="You are about to send"  >
        <div className="p15">
          <TransferPreview modal={modal} />
        </div>
      </Modal>

    </div>
  );
}

export default Modals;
