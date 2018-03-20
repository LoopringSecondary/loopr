import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert,Card,Icon} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'

const PlaceOrderSuccess = ({modal
  }) => {

  const {warn} = modal;

  const MetaItem = (item)=>{
    return (
      <div className="">
        <Icon className="color-red-500 mr10" type="close-circle-o" />{item.value.symbol} balance is not enough
        <a onClick={gotoReceive} className="ml15 color-blue-500">Receive <Icon type="right" /></a>
        {item.value.symbol.toUpperCase() !== 'WETH' && <a onClick={gotoBuy.bind(this,item.value.symbol)} className="ml15 color-blue-500">Buy <Icon type="right" /></a>}
        {item.value.symbol.toUpperCase() === 'WETH' && <a onClick={gotoConvert.bind(this,item.value.symbol)} className="ml15 color-blue-500">Buy <Icon type="right" /></a>}
      </div>
    )
  }
  const gotoReceive = ()=>{
   modal.showModal.bind(this,'token/receive')
  };
  const gotoConvert = ()=>{
    modal.showModal.bind(this,{id:'token/convert',item:{symbol:'ETH'}})
  };
  const gotoBuy = (token)=>{
    window.routeActions.gotoPath.bind(this,`/trade/${token.toUpperCase()}-WETH`)
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
      {warn && warn.length > 0 &&  <div className="p15 bg-grey-100" style={{borderRadius:'6px'}}>
        <div className="fs12 color-grey-500 mb10">
          Before your orders can be filled. You should do things followed: (<a href="">Why</a>)
        </div>
        {warn.map(item => MetaItem(item))}
      </div>
      }
    </Card>
  )
}

export default PlaceOrderSuccess


