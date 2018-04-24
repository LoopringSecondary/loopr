import React from 'react';
import {connect} from 'dva';
import {Modal} from 'antd';
@connect(
	({modals})=>({modals:modals})
)
export default class ModalContainer extends React.Component {
  shouldComponentUpdate(nextProps, nextState){
    const { id } = this.props
    if(nextProps.modals[id] === this.props.modals[id]){
      return false
    }else{
      return true
    }
  }
  render() {
  	const {dispatch,modals,id,width,apisOnly=false,closable=true,maskClosable=false,...rest} = this.props
  	let thisModal = modals[id] || {}
    // console.log('modal container render',id)
  	const hideModal = (payload)=>{
      dispatch({
        type:'modals/modalChange',
        payload:{
          ...payload,
          visible:false,
        }
      })
    }
    const hideThisModal = (payload)=>{
      dispatch({
        type:'modals/modalChange',
        payload:{
          id,
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
    const showLoading = (payload)=>{
      dispatch({
        type:'modals/modalChange',
        payload:{
          ...payload,
          loading:true,
        }
      })
    }
    const hideLoading = (payload)=>{
      dispatch({
        type:'modals/modalChange',
        payload:{
          ...payload,
          loading:false,
        }
      })
    }
    const modalChange = (payload)=>{
  	  dispatch({
  	  	type:'modals/modalChange',
  	  	payload:{
  	  		...payload,
  	  	}
  	  })
  	}

  	const modalProps = {
  		visible:thisModal.visible,
      width,
      destroyOnClose:true,
  		title:null,
  		footer:null,
  		closable,
      maskClosable,
      // wrapClassName:"rs", // reset modal
  		className:"rs", // reset modal
  		onCancel:hideModal.bind(this,{id}),
  	}
  	let childProps = {
      ...rest,
      modals:{
        ...modals,
        showModal:showModal.bind(this),
        hideModal:hideModal.bind(this),
        showLoading:showLoading.bind(this),
        hideLoading:hideLoading.bind(this),
        modalChange:modalChange.bind(this),
      },
      modal:{
        ...thisModal,
        showModal:showModal.bind(this),
        hideModal:hideModal.bind(this),
        hideThisModal:hideThisModal.bind(this),
        showLoading:showLoading.bind(this),
        hideLoading:hideLoading.bind(this),
        modalChange:modalChange.bind(this),
      },
  	}
    if(!apisOnly){
        return (
          <Modal {...modalProps}>
            {
              React.Children.map(this.props.children, child => {
                  return React.cloneElement(child, {...childProps})
              })
            }
          </Modal>
        )
    }else{
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
}
