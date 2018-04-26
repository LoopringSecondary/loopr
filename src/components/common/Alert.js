import React, { PropTypes } from 'react';
import {Button,Icon} from 'antd';

const Alert = ({title,description,type='info',theme='dark',actions,size="medium",className="",...rest})=>{
  return (
    <div className={`loopring-alert t-${type} t-${theme} s-${size} ${className}`} {...rest}>
      <div className="row align-items-center">
        {
          type &&
          <div className="col-auto alert-gutter">
            {
              type === 'success' &&
              <i className="icon-loopring icon-loopring-success alert-icon"  />
            }
            {
              type === 'info' &&
              <i className="icon-loopring icon-loopring-success alert-icon"  />
              &&
              <Icon type="info-circle-o" className="alert-icon" />
            }
            {
              type === 'warning' &&
              <i className="icon-loopring icon-loopring-warn alert-icon"  />
            }

            {
              type === 'error' &&
              <i className="icon-loopring icon-loopring-close alert-icon"  />
            }
          </div>
        }
        <div className="col alert-gutter">
          <div className="alert-title">{title}</div>
          {
            description &&
            <div className="alert-description">{description}</div>
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
