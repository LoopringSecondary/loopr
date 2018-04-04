import React, { PropTypes } from 'react';
import {Button,Icon} from 'antd';

const Alert = ({title,description,type='info',theme='light',actions})=>{
  return (
    <div className={`p15 loopring-alert t-${type} t-${theme}`}>
      <div className="row align-items-center">
        {
          type &&
          <div className="col-auto pr0 pr15">
            {
              type === 'success' &&
              <i className="icon-loopring icon-loopring-success fs35 alert-icon"  />
              &&
              <Icon type="check-circle-o" className="fs35 alert-icon" />
            }
            {
              type === 'info' &&
              <i className="icon-loopring icon-loopring-success fs35 alert-icon"  />
              &&
              <Icon type="info-circle-o" className="fs35 alert-icon" />
            }
            {
              type === 'warning' &&
              <i className="icon-loopring icon-loopring-qustion fs35 alert-icon"  />
              &&
              <Icon type="exclamation-circle-o" className="fs35 alert-icon" />
            }

            {
              type === 'error' &&
              <i className="icon-loopring icon-loopring-close fs35 alert-icon"  />
            }
          </div>
        }
        <div className="col pl0 pr15">
          <div className="fs18 font-weight-bold alert-title">{title}</div>
          {
            description &&
            <div className="fs14 mt5 alert-description" style={{lineHeight:'1.4'}}>{description}</div>
          }
          {
            actions &&
            <div className="alert-actions">{actions}</div>
          }
        </div>
      </div>

    </div>
  )
}

export default Alert
