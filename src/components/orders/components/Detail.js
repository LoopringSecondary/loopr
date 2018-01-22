import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,ListItem,Avatar,Icon,Button } from 'antd';
import schema from '../../../modules/orders/schema';

function DetailBlock({LIST={},actions={}}) {
  let { items=[],loading } = LIST
  const item = items[0] || {}
  const renders = {
      orderHash:(value,item,index)=><Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/orders/detail/${value}`}>{value}</Link>,
      status:(value,item,index)=>value,
  }
  const MetaItem = (props)=>{
    const {label,value} = props
    return (
      <div className="row pt10 pb10 pl0 pr0 zb-b-b">
        <div className="col">
          <div className="fs14 color-grey-600">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  const ArrowDivider = (props)=>{
    return (
      <div className="row no-gutters align-items-center fs12" style={{marginTop:'-20px'}}>
        <div className="col">
          <hr className="w-100 bg-grey-900"/>
        </div>
        <div className="col-auto">
          <Icon type="right" className="color-grey-900" style={{marginLeft:'-8px'}}></Icon>
        </div>
      </div>
    )
  }
  return (
    <Card title="Order Detail">
      <div className="row flex-nowrap zb-b-b pb30 justify-content-center align-items-center">
        <div className="col-auto">
          <div className="text-center">
            <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            <div className="fs12 color-grey-900 text-wrap" style={{maxWidth:'180px'}}>LRC</div>
          </div>
        </div>
        <div className="col-1">
          <div className="text-center">
            <ArrowDivider />
          </div>
        </div>
        <div className="col-auto">
          <div className="text-center">
            <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            <div className="fs12 color-grey-900 text-wrap" style={{maxWidth:'180px'}}>ETH</div>
          </div>
        </div>
      </div>
      <MetaItem label="Status" value={"Completed"} />
      <MetaItem label="Hash" value={<a href="" target="_blank">0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00</a>} />
      <MetaItem label="Fill Sell Amount" value="500/500LRC" />
      <MetaItem label="Fill Buy Amount" value="0.5/0.5ETH" />
      <MetaItem label="Ring" value="0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00" />
      <div className="row pt40">
        <div className="col pl0">
          <Button className="d-block w-100" type="" size="large">View More Info in Ringinfo.io</Button>
        </div>
      </div>
    </Card>
      
  );
}

export default DetailBlock;
