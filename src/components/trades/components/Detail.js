import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,ListItem,Button } from 'antd';
import schema from '../../../modules/trades/schema';
const MetaItem = (props)=>{
  const {label,value} = props
  return (
    <div className="row pt10 pb10 zb-b-b">
      <div className="col">
        <div className="fs14 color-grey-600">{label}</div>
      </div>
      <div className="col-8 text-right">
        <div className="fs12 color-grey-900 text-wrap">{value}</div>
      </div>
    </div>
  )
}
// <MetaItem label= value={renders.status(null,item)} />
function DetailBlock({modal={}}) {
  let item = modal.item || {}
  const renders = {
      ringHash:(value,item,index)=><Link className="text-truncate d-block" style={{}} to={`/rings/detail/${value}`}>{value}</Link>,
      miner:(value,item,index)=> <Link className="text-truncate d-block" style={{}} to={`/miner/detail/${value}`}>{value}</Link>,
      feeRecipient:(value,item,index)=> <a className="text-truncate d-block" style={{}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
      txHash:(value,item,index)=> <a className="text-truncate d-block" style={{}} target="_blank" href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber:(value,item,index)=> <a className="text-truncate d-block" style={{}} target="_blank" href={`https://etherscan.io/block/${value}`}>{value}</a>,
      protocol:(value,item,index)=> <a className="text-truncate d-block" style={{}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
  }
  return (
    <div className="">
      <Card title="Ring Infomation" loading={false}>
        <MetaItem label="RingHash" value={item.ringHash} />
        <MetaItem label="Field" value="value" />
        <MetaItem label="Field" value="value" />
        <MetaItem label="Field" value="value" />
        <div className="mb30"></div>
        <Button type="default" className="d-block w-100" size="large"> More Detail About Ring, Goto Ringinfo</Button>
      </Card>
    </div>
  );
}

export default DetailBlock;
