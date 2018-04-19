import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';

const TickerTrend = ({ side='up', children, className, ...rest }) => {
  return (
    <div {...rest} className={className} title={typeof children === 'string' ? children : ''}>
      {side==='up' && (
        <span className="color-green-600">
          {children}
        </span>
      )}
      {side==='down' && (
        <span className="color-red-600">
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
};

export default TickerTrend;
