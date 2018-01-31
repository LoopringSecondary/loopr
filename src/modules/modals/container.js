import React from 'react';
import {connect} from 'dva';
import {Modal} from 'antd';

@connect(
	({modals})=>({modals})
)
export default class ModalContainer extends React.Component {
  render() {
  	const {dispatch,modals,id,title} = this.props
  	let thisModal = modals[id] || {}

  	const hideModal = (payload)=>{
      dispatch({
        type:'modals/modalChange',
        payload:{
          ...payload,
          visible:false,
        }
      })
    }
    const showModal = (payload)=>{
  	  dispatch({
  	  	type:'modals/modalChange',
  	  	payload:{
  	  		...payload,
  	  		visible:true,
  	  	}
  	  })
  	}
  	const modalProps = {
  		visible:thisModal.visible,
  		title:null,
  		footer:null,
  		closable:true,
  		maskClosable:true,
      // wrapClassName:"rs", // reset modal
  		className:"rs", // reset modal
  		onCancel:hideModal.bind(this,{id}),
  	}
  	let childProps = {
      modals:{
        ...modals,
        showModal:showModal.bind(this),
        hideModal:hideModal.bind(this),
      }
  	}
    return (
  		<Modal {...modalProps}>
  			{
  			  React.Children.map(this.props.children, child => {
  			      return React.cloneElement(child, {...childProps})
  			  })
  			}
  		</Modal>
    )
  }
}
