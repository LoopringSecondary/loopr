import React, { PropTypes } from 'react';
import {Button,notification} from 'antd';
import Alert from './Alert';

export default {
  open:(config)=>{
    let className = 'loopring-notify'
    let {message:title,description,type,theme,actions,size,...rest} = config
    let alertProps = {
      title,description,type,theme,actions,size,
    }
    notification.success({
      ...rest,
      className,
      description:null,
      icon:null,
      message:<Alert {...alertProps} />
    })
  }
}
