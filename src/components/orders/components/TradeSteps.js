import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'

const TradeSteps = ({
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

  return (
      <div>
        {
          false &&
          <Modal title="Place Order Steps" visible={false} footer={null} width="600px">
          </Modal>
        }
        <div className="text-center p15 zb-b-b">
          <img src={iconSuccess} alt="" style={{width:'60px'}} className="mb15"/>
          <div className="fs24 color-grey-900 mb10">Success</div>
          <div className="fs14 color-grey-500">
            Congratulation! Your order is under trading now!
          </div>
        </div>
        <div className="pt15 pb15">
          <div className="fs12 color-grey-500 mb10">
            Your order has been submitted successfully, but you need to enable the following tokend before your orders can be filled. Why?
          </div>

          <Alert type="error" message="TODO" showIcon>

          </Alert>
        </div>
      </div>
        
      
  );
};

export default TradeSteps

 
