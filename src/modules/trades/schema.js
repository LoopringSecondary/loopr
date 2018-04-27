import React from 'react';
import intl from 'react-intl-universal';

const schema = [
  {
    title: () => intl.get('trade.ring'),
    description: 'The ring Index',
    name: 'ringIndex',
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
    title: () => intl.get('orders.LrcFee'),
    description: 'The total lrc fee.',
    name: 'lrcFee',
  },
  {
    title: () => intl.get('orders.LrcReward'),
    description: 'The total lrc Reward.',
    name: 'lrcReward',
  },
  {
    title: () => intl.get('orders.time'),
    description: 'The ring matched time',
    name: 'time',
  },
];
export default schema
