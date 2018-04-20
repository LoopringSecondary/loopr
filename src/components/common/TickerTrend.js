import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';

const TickerTrend = ({ side='up', mode="color", children, className, ...rest }) => {
  if(mode==='nocolor'){
    return (
      <div {...rest} className={className} title={typeof children === 'string' ? children : ''}>
        <span className="">
          {children}
        </span>
      </div>
    )
  }else{
    return (
      <div {...rest} className={className} title={typeof children === 'string' ? children : ''}>
        {side==='up' && (
          <span className="color-green-500">
            {children}
          </span>
        )}
        {side==='down' && (
          <span className="color-red-500">
            {children}
          </span>
        )}
        {side==='none' && (
          <span className="">
            {children}
          </span>
        )}
      </div>
    );
  }

};

export default TickerTrend;
