import React from 'react';

class ModalContainer extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
    }
  }
  showModal(type,paylaod){
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
        showModal:this.showModal.bind(this), // fix bug for context error
        hideModal:this.hideModal.bind(this), // fix bug for context error
        ...this.state,
      }
    }
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