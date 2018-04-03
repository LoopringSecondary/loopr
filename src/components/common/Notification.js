import React, { PropTypes } from 'react';
import {Button,notification} from 'antd';

const Alert = ()=>{
  return (
    <div className="p15 bg-blue-500">
      <div className="fs16 color-white">Tilte</div>
      <div className="fs12 color-white">Description</div>
      <Button size='small'>Close</Button>
    </div>
  )
}

export default {
  success:(config)=>{
    let className = 'loopring-notify'
    let {message,description} = config
    notification.success({
      ...config,
      className,
      description:null,
      icon:null,
      message:<Alert />
    })
  }
}
