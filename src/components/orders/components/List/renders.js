import React from 'react';
import {Link} from 'dva/router';
import {Table, Badge, Button, Modal, Icon, Popover, Steps} from 'antd';

export default {
    market: (value, item, index) => item.originalOrder && item.originalOrder.market,
    status: (value, item, index) => {
      let status
      if (item.status === 'ORDER_OPENED') { status = <Badge status="processing" text="Opened"/>}
      if (item.status === 'ORDER_FINISHED') { status = <Badge status="success" text="Completed"/>}
      if (item.status === 'ORDER_CANCELED') { status = <Badge status="default" text="Cancelled"/>}
      if (item.status === 'ORDER_EXPIRE') { status = <Badge status="default" text="Expired"/>}
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
