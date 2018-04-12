import React from 'react';
import {Icon} from 'antd';
import intl from 'react-intl-universal';

const schema = [
  {
    title: () => <span>{intl.get('trade.ring')} <a onClick={()=>{}}><Icon type="question-circle-o"/></a></span>,
    description: 'The ring hash',
    name: 'ringHash',
  },
  {
    title: () => intl.get('orders.market'),
    name: 'market',
  },
  {
    title: () => intl.get('orders.side'),
    name: 'side',
  },
  {
    title: () => intl.get('orders.amount'),
    description: 'The fills number int the ring.',
    name: 'amount',
  },
  {
    title: () => intl.get('orders.price'),
    description: 'The fills number int the ring.',
    name: 'price',
  },
  {
    title: () => intl.get('orders.total'),
    description: 'The fills number int the ring.',
    name: 'total',
  },
  {
    title: () => <span>{intl.get('orders.LrcFee')} <a onClick={()=>{}}><Icon type="question-circle-o"/></a></span>,
    description: 'The total lrc fee.',
    name: 'lrcFee',
  },

  {
    title: () => intl.get('orders.time'),
    description: 'The ring matched time',
    name: 'time',
  },
];
export default schema
