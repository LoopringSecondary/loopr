import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button } from 'antd';


function Welcome(props) {
  return (
    <div className="text-center">
      <div className="fs30 color-grey-900 mb10">Welcome To Loopring Wallet</div>
      <div className="fs18 color-grey-900">Secure token trading from your own wallet</div>
      <div className="mb10">
        <Button type="primary">Unlock Wallet</Button>
        <Button type="primary">Generate Wallet</Button>  
      </div>
    </div>
  )
}

export default Welcome;
