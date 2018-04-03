import React, { PropTypes } from 'react';
import {Button,notification} from 'antd';
import Alert from './Alert';

export default {
  open:(config)=>{
    let className = 'loopring-notify'
    let {message:title,description,type,theme,actions} = config
    let alertProps = {
      title,description,type,theme,actions,
    }
    notification.success({
      ...config,
      className,
      description:null,
      icon:null,
      message:<Alert {...alertProps} />
    })
  }
}
