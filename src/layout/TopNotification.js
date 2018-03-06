import React from 'react';
import {connect} from 'dva';
import {FormattedMessage,injectIntl} from 'react-intl';
import {Menu,Select,Popover,Button,Icon,message,Alert} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo-blue@2x.png'
import copy from 'copy-to-clipboard';

function TopNotification(props){
  return (
    <div className="">
      <Alert type="error" banner closable>
        <div className="container">
          nihao
        </div>
      </Alert>

    </div>
  )
}
export default TopNotification
