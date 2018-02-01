import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';

let Preview = ({
  modals,
  }) => {

  const handelSubmit = ()=>{
    modals.hideModal({id:'token/transfer/preview'})
    modals.showModal({id:'token/transfer/result'})
  }

  const handelCancel = ()=>{
    modals.hideModal({id:'token/transfer/preview'})
  }



  const MetaItem = (props)=>{
    const {label,value} = props
    return (
      <div className="row pt10 pb10 zb-b-b">
        <div className="col">
          <div className="fs14 color-grey-600">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  const ArrowDivider = (
      <div className="row no-gutters align-items-center">
        <div className="col">
          <hr className="w-100 bg-grey-900"/>
        </div>
        <div className="col-auto">
          <Icon type="right" className="color-grey-900" style={{marginLeft:'-9px'}}></Icon>
        </div>
      </div>
  )
  return (
      <Card title="You are about to send">
        <div className="row flex-nowrap zb-b-b pb30">
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            </div>
          </div>
          <div className="col">
            <div className="text-center">
              <Avatar size="" className="bg-white border-grey-900" src="https://loopring.io/images/favicon.ico"></Avatar>
              <div className="fs12 color-grey-500">LRC</div>
              {ArrowDivider}
              <div className="fs14 color-grey-900">-2000LRC($4000)</div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            </div>
          </div>
        </div>
        <MetaItem label="From" value="0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00" />
        <MetaItem label="To" value="0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00" />
        <MetaItem label="GasLimit" value="2100" />
        <MetaItem label="GasPrice" value="21 Gwei" />
        <MetaItem label="Transaction Fee" value="0.00012 ETH ( USD 2.2 )" />
        <div className="row pt40">
          <div className="col pl0">
            <Button onClick={handelCancel} className="d-block w-100" type="" size="large">No, Cancel It</Button>
          </div>
          <div className="col pr0">
            <Button onClick={handelSubmit} className="d-block w-100" type="primary" size="large">Yes, Send Now</Button>
          </div>
        </div>
      </Card>
  );
};


export default Preview;

 
