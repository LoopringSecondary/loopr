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
      <div className="p25">
        <div className="text-center p15">
          <Icon type="close-circle" className="color-red-500" style={{fontSize:'72px'}}/>
          <div className="fs24 color-grey-900 mb5 mt15">{intl.get("trade.place_order_failed")}</div>
        </div>
        <div className="p10 bg-grey-50" style={{borderRadius:'4px'}}>
          <div className="fs14">
            {intl.get("trade.failed_reasons")}
            {false && <Icon className="ml5" type="question-circle"/> }
          </div>
          {errors &&
            errors.map((item, index) => {
              if(item.type === 'BalanceNotEnough'){
                return (
                  <div className="m5" key={index}>
                    <Icon className="color-error-1 mr10" type="close-circle-o" />{intl.get('trade.balance_not_enough', {token:item.value.symbol.toUpperCase(),required:item.value.required})}
                    <a className="color-primary-1 ml10" onClick={gotoReceive}>{intl.get('trade.receive')} </a>
                    <span className="fs12 ml5 mr5">or</span>
                    <a className="color-primary" onClick={gotoBuy.bind(this,item.value.symbol)}>{intl.get('trade.to_buy')}</a>
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
      </div>

    </Card>
  )
}

export default PlaceOrderError


