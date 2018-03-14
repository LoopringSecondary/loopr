import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert,Card,Icon} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'

const PlaceOrderError = ({
    modal
  }) => {
  const {errors} = modal

  const gotoReceive = ()=>{

  }
  const gotoConvert = ()=>{

  }
  const gotoBuy = ()=>{

  }
  return (
    <Card title="Placing Order">
      <div className="text-center p15 zb-b-b">
        <Icon type="close-circle" className="color-red-500" style={{fontSize:'72px'}}/>
        <div className="fs24 color-grey-900 mb10">Place Order Failed !</div>
        <div className="fs14 color-grey-500">
          Some Tip Some Tip Some Tip Some Tip
        </div>
      </div>
      <div className="p15 bg-grey-100" style={{borderRadius:'6px'}}>
        <div className="fs12 color-grey-500 mb10">
          You should do things followed: (<a href="">Why</a>)
        </div>
        {errors &&
          errors.map((item, index) => {
            if(item.type === 'BalanceNotEnough'){
              return (
                <div className="" key={index}>
                  <Icon className="color-red-500 mr10" type="close-circle-o" />{`${item.value.symbol.toUpperCase()} blance is not enough, required ${item.value.required}`}
                  <a className="ml15 color-blue-500">Receive <Icon type="right" /></a>
                  <a className="ml15 color-blue-500">Buy <Icon type="right" /></a>
                </div>
              )
            }else if(!item.type || item.type === 'unknown' ){
              return (
                <div className="" key={index}>
                  {item.message}
                </div>
              )
            }
          })
        }
      </div>
    </Card>
  )
}

export default PlaceOrderError


