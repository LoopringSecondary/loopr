import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert,Card,Icon} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'

const PlaceOrderSuccess = ({
  }) => {
  const MetaItem = (props)=>{
    const {label,value}=props
    return (
      <div className="row zb-b-b pt10 pb10 no-gutters">
        <div className="col">
          <div className="fs14 color-grey-500">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  const gotoReceive = ()=>{

    this.props.modal.showModal.bind(this,'token/receive')

  };
  const gotoConvert = ()=>{

  };
  const gotoBuy = ()=>{

  };
  return (
    <Card title="Placing Order">
      <div className="text-center p15 zb-b-b">
        <img src={iconSuccess} alt="" style={{width:'60px'}} className="mb15"/>
        <div className="fs24 color-grey-900 mb10">Success</div>
        <div className="fs14 color-grey-500">
          Congratulation! Your order is under trading now!
        </div>
      </div>
      <div className="p15 bg-grey-100" style={{borderRadius:'6px'}}>
        <div className="fs12 color-grey-500 mb10">
          Before your orders can be filled. You should do things followed: (<a href="">Why</a>)
        </div>
        <div className="">
          <Icon className="color-red-500 mr10" type="close-circle-o" />xxToken blance is not enough
          <a onClick={gotoReceive} className="ml15 color-blue-500">Receive <Icon type="right" /></a>
          <a onClick={gotoBuy} className="ml15 color-blue-500">Buy <Icon type="right" /></a>
        </div>
        <div className="">
          <Icon className="color-red-500 mr10" type="close-circle-o" />WETH blance is not enough
          <a onClick={gotoReceive} className="ml15 color-blue-500">Receive <Icon type="right" /></a>
          <a className="ml15 color-blue-500">Convert <Icon type="right" /></a>
        </div>
      </div>
    </Card>
  )
}

export default PlaceOrderSuccess


