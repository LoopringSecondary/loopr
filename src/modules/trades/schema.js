import React from 'react';
import {Icon,Popover} from 'antd';

const schema = [
  {
    title: <span>Ring <a onClick={()=>{}}><Icon type="question-circle"></Icon></a></span>,
    description: 'The ring hash',
    name: 'ringHash',
  },
  {
    title: 'Maket',
    name: 'market',
  },
  {
    title: 'Side',
    name: 'side',
  },
  {
    title: 'Amount',
    description: 'The fills number int the ring.',
    name: 'amount',
  },
  {
    title: 'Price',
    description: 'The fills number int the ring.',
    name: 'price',
  },
  {
    title: 'Total',
    description: 'The fills number int the ring.',
    name: 'total',
  },
  {
    title: <span>LRC Fee <a onClick={()=>{}}><Icon type="question-circle"></Icon></a></span>,
    description: 'The total lrc fee.',
    name: 'lrcFee',
  },

  {
    title: 'Time',
    description: 'The ring matched time',
    name: 'time',
  },
]
export default schema
