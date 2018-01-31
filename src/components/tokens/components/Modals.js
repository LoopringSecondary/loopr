import React, { PropTypes } from 'react';
import { Modal,Divider} from 'antd';
import Transfer from './Transfer'
import TransferPreview from './TransferPreview'
import Receive from './Receive'
import Convert from './Convert'
import AddToken from './AddToken'
import EditToken from './EditToken'
import ModalContainer from '../../../modules/modals/container'

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
      <ModalContainer id='token/transfer'>
        <Transfer />
      </ModalContainer>
      <ModalContainer id='token/transfer/preview'>
        <TransferPreview />
      </ModalContainer>
      <ModalContainer id='token/conver'>
        <Convert />
      </ModalContainer>
      <ModalContainer id='token/add'>
        <AddToken />
      </ModalContainer>
      <ModalContainer id='token/edit'>
        <EditToken />
      </ModalContainer>
      {
        false  &&
        <div>
          <Modal {...getModalProps('token/transfer')} title="Send LRC"  >
            <Transfer />
          </Modal>
          <Modal {...getModalProps('token/receive')} title="My Ethereum Address"  >
            <Receive modal={modal} />
          </Modal>
          <Modal {...getModalProps('token/wrap')} title="Wrap ETH to WETH"  >
            <Convert modal={modal} />
          </Modal>
          <Modal {...getModalProps('token/transfer/preview')} width="50%" style={{maxWidth:'100%',width:'60%'}} title="You are about to send"  >
            <div className="p15">
              <TransferPreview modal={modal} />
            </div>
          </Modal>
          <Modal {...getModalProps('token/add')} title="Add Token"  >
              <AddToken modal={modal} />
          </Modal>
          <Modal {...getModalProps('token/edit')} title="Edit Token"  >
              <EditToken modal={modal} />
          </Modal>
        </div>
      }
    </div>
  );
}

export default Modals;
