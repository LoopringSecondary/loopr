import React from 'react';
import {Card, Icon, Button} from 'antd';
import iconSuccess from '../../../assets/images/icon-success.png'
import intl from 'react-intl-universal';


class PlaceOrderSuccess extends React.Component {
  render() {
    const {modal} = this.props;
    const {warn} = modal;
    const MetaItem = (item, index) => {
      return (
        <div className="m5 color-black-2" key={index}>
          <Icon className="color-error-1 mr5" type="close-circle-o"/>
          {intl.get('order.balance_not_enough', {token: item.value.symbol})}
          <a onClick={modal.showModal.bind(this, {id: 'token/receive'})}
             className="ml15 color-primary-1">{intl.get('order.receive')}<Icon type="right"/></a>
          {item.value.symbol.toUpperCase() !== 'WETH' &&
          <a onClick={window.routeActions.gotoPath.bind(this, `/trade/${item.value.symbol.toUpperCase()}-WETH`)}
             className="ml15 color-primary-1">{intl.get('order.buy')} <Icon type="right"/></a>}
          {item.value.symbol.toUpperCase() === 'WETH' &&
          <a onClick={modal.showModal.bind(this, {id: 'token/convert', item: {symbol: 'ETH'}})}
             className="ml15 color-primary-1">{intl.get('txs.type_convert')} <Icon type="right"/></a>}
        </div>
      )
    };
    return (
      <Card title={intl.get('order.placing_order')}>
        <div className="p25">
          <div className="text-center">
            <img src={iconSuccess} alt="" style={{width: '60px'}} className="mb5"/>
            <div className="fs24 color-black-1 mb5">{intl.get('order.place_success')}</div>
            <div className="fs14 color-black-3 mb20">
              {intl.get('order.place_success_tip')}
            </div>
          </div>
          {warn && warn.length > 0 &&
          <div className="p10 bg-grey-50" style={{borderRadius: '4px'}}>
            <div className="fs14 m5 color-black-2">
              {intl.get('trade.you_should_do_things')}
              <Icon className="ml5" type="question-circle"/>
            </div>

            {warn.map((item, index) => MetaItem(item, index))}
          </div>
          }
          <div className="row pt30">
            <div className="col pr15">
              <Button className="d-block w-100" onClick={modal.hideModal.bind(this, {id: 'trade/place-order-success'})}
                      type="primary" size="large">Go on to trade</Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }


}

export default PlaceOrderSuccess


