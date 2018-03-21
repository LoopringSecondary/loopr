import React from 'react';
import { Modal,Collapse,Button,Input,Steps,Popover,Alert,Card,Icon} from 'antd';
import intl from 'react-intl-universal';

const PlaceOrderError = ({
    modal
  }) => {
  const {errors} = modal

  const gotoReceive = ()=>{
    modal.showModal({id:'token/receive'})
  }

  const gotoBuy = (token)=>{
    modal.hideModal({id:'trade/place-order-error'})
    window.routeActions.gotoPath(`/trade/${token.toUpperCase()}-WETH`)
  }

  return (
    <Card title={intl.get('trade.placing_order')}>
      <div className="text-center p15 zb-b-b">
        <Icon type="close-circle" className="color-red-500" style={{fontSize:'72px'}}/>
        <div className="fs24 color-grey-900 mb10">{intl.get("trade.place_order_failed")}</div>
        <div className="fs14 color-grey-500">

        </div>
      </div>
      <div className="p15 bg-grey-100" style={{borderRadius:'6px'}}>
        <div className="fs12 color-grey-500 mb10">
          {intl.get("trade.you_should_do_things")}: (<a href="">{intl.get("trade.why")}</a>)
        </div>
        {errors &&
          errors.map((item, index) => {
            if(item.type === 'BalanceNotEnough'){
              return (
                <div className="" key={index}>
                  <Icon className="color-red-500 mr10" type="close-circle-o" />{intl.get('trade.balance_not_enough', {token:item.value.symbol.toUpperCase(),required:item.value.required})}
                  <a className="ml15 color-blue-500" onClick={gotoReceive}>{intl.get('trade.receive')} <Icon type="right" /></a>
                  <a className="ml15 color-blue-500" onClick={gotoBuy.bind(this,item.value.symbol)}>{intl.get('trade.to_buy')} <Icon type="right" /></a>
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


