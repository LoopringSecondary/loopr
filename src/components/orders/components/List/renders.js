import React from 'react';
import {Link} from 'dva/router';
import {Table, Badge, Button, Modal, Icon, Popover, Steps} from 'antd';
import intl from 'react-intl-universal';

export default {
    market: (value, item, index) => item.originalOrder && item.originalOrder.market,
    status: (value, item, index) => {
      let status
      if (item.status === 'ORDER_OPENED') {
        status = <Badge className="fs12" status="processing" text={intl.get('orders.status_opened')}/>
      }
      if (item.status === 'ORDER_FINISHED') {
        status = <Badge className="fs12" status="success" text={intl.get('orders.status_completed')}/>
      }
      if (item.status === 'ORDER_CANCELLED') {
        status = <Badge className="fs12" status="default" text={intl.get('orders.status_canceled')}/>
      }
      if (item.status === 'ORDER_CUTOFF') {
        status = <Badge className="fs12" status="default" text={intl.get('orders.status_canceled')}/>
      }
      if (item.status === 'ORDER_EXPIRE') {
        status = <Badge className="fs12" status="default" text={intl.get('orders.status_expired')}/>
      }
      return (
        <div>
          {status}
        </div>
      )
    },
    side: (value, item, index) => {
      if (item.originalOrder.side === 'sell') {
        return <div className="color-green-500">Sell</div>
      }
      if (item.originalOrder.side === 'buy') {
        return <div className="color-red-500">Buy</div>
      }
    },
  }
