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
  	  		id:id,
  	  		visible:false,
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
  		onCancel:hideModal.bind(this),
  	}
  	let childProps = {
  	  ...this.props,
  	  modals,
  	  dispatch,
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
