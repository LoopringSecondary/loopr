import React, { PropTypes } from 'react';
import {Button,notification} from 'antd';

const Alert = ({title,description})=>{
  return (
    <div className="p15 loopring-alert t-light t-success">
      <div className="row align-items-center">
        <div className="col-auto pr0 pr15">
          <i className="icon-loopring icon-loopring-success fs35 alert-icon"  />
        </div>
        <div className="col pl0 pr15">
          <div className="fs18 font-weight-bold alert-title">{title}</div>
          {
            description &&
            <div className="fs14 mt5 alert-description" style={{lineHeight:'1.4'}}>{description}</div>
          }
          {
            false &&
            <Button size='' className="fs14 mt5 alert-btn">Close</Button>
          }
        </div>
      </div>

    </div>
  )
}

export default {
  success:(config)=>{
    let className = 'loopring-notify'
    let {message:title,description} = config
    let alertProps = {title,description}
    notification.success({
      ...config,
      className,
      description:null,
      icon:null,
      message:<Alert {...alertProps} />
    })
  }
}
