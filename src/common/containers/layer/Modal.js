import React from 'react';

class ModalContainer extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
    }
  }
  showModal(type,paylaod){
    console.log('modal container this',this)
    this.setState({
      [type]:{
        visible:true,
        data:paylaod,
      }
    })
  }
  hideModal(type,paylaod){
    this.setState({
      [type]:{
        visible:false,
        data:paylaod,
      }
    })
  }
  render() {
    let childProps = {
      ...this.props,
      modal:{
        state:this.state,
        actions:{
          showModal:this.showModal,
          hideModal:this.hideModal,
        }
      }
    }
    console.log('modal childProps',childProps)
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

export default ModalContainer;