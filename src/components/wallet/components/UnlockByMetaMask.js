import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs } from 'antd';


function UnLockByMetaMask(props) {
  return (
    <div className="text-left">
      <div className="color-grey-500 fs12 mb10">
        Download MetaMask For Chrome
      </div>
      <div className="color-grey-500 fs12 mb10">
        Download MetaMask For Other Browser
      </div>
      <Button type="primary" className="d-block w-100" size="large">Connect To MetaMask</Button>
    </div>
  )
}

export default UnLockByMetaMask;
