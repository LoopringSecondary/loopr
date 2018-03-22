import React from 'react';
import {Card, Icon} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'
import intl from 'react-intl-universal';
const PlaceOrderSuccess = ({modal
  }) => {
  const {warn} = modal;
  const MetaItem = (item)=>{
    return (
      <div className="">
        <Icon className="color-red-500 mr10" type="close-circle-o" />{intl.get('order.balance_not_enough',{token:item.value.symbol})}
        <a onClick={modal.showModal.bind(this,{id:'token/receive'})} className="ml15 color-blue-500">{intl.get('order.receive')}<Icon type="right" /></a>
        {item.value.symbol.toUpperCase() !== 'WETH' && <a onClick={window.routeActions.gotoPath.bind(this,`/trade/${item.value.symbol.toUpperCase()}-WETH`)} className="ml15 color-blue-500">{intl.get('order.buy')} <Icon type="right" /></a>}
        {item.value.symbol.toUpperCase() === 'WETH' && <a onClick={modal.showModal.bind(this,{id:'token/convert',item:{symbol:'ETH'}})} className="ml15 color-blue-500">{intl.get('order.convert')} <Icon type="right" /></a>}
      </div>
    )
  };
  return (
    <Card title={intl.get('order.placing_order')}>
      <div className="text-center p15">
        <img src={iconSuccess} alt="" style={{width:'60px'}} className="mb15"/>
        <div className="fs24 color-grey-900 mb10">{intl.get('order.place_success')}</div>
        <div className="fs14 color-grey-500">
          {intl.get('order.place_success_tip')}
        </div>
      </div>
      {warn && warn.length > 0 &&  <div className="p15 bg-grey-100" style={{borderRadius:'6px'}}>
        <div className="fs12 color-grey-500 mb10">
          {intl.get('order.place_warn')} (<a href="">Why</a>)
        </div>
        {warn.map(item => MetaItem(item))}
      </div>
      }
    </Card>
  )
}

export default PlaceOrderSuccess


