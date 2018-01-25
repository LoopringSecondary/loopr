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

  	const showModal = (payload)=>{
  	  dispatch({
  	  	type:'modals/modalChange',
  	  	payload:{
  	  		...payload,
  	  		id:id,
  	  		visible:true,
  	  	}
  	  })
  	}
  	const hideModal = (payload)=>{
  	  dispatch({
  	  	type:'modals/modalChange',
  	  	payload:{
  	  		...payload,
  	  		id:id,
  	  		visible:false,
  	  	}
  	  })
  	}
  	const modalProps = {
  		visible:thisModal.visible,
  		title:thisModal.title || title,
  		footer:null,
  		closable:true,
  		maskClosable:true,
  		wrapClassName:"rs",
  		onCancel:hideModal.bind(this),
  	}
  	let childProps = {
  	  ...this.props,
  	  modals:{
  	    showModal:showModal.bind(this), // fix bug for context error
  	    hideModal:hideModal.bind(this), // fix bug for context error
  	    ...modals,
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
