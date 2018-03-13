import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert,Card,Icon} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'

const PlaceOrderError = (props) => {

  const gotoReceive = ()=>{

  }
  const gotoConvert = ()=>{

  }
  const gotoBuy = ()=>{

  }

  const {modals} =  props;
  const {errorMessage} = modals['trade/place-order-error'];
  return (
    <Card title="Placing Order">
      <div className="text-center p15 zb-b-b">
        <Icon type="close-circle" className="color-red-500" style={{fontSize:'72px'}}/>
        <div className="fs24 color-grey-900 mb10">Place Order Failed !</div>
        <div className="fs14 color-grey-500">
          {errorMessage}
        </div>
      </div>
    </Card>
  )
}

export default PlaceOrderError


