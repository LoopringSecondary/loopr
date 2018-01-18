import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,ListItem } from 'antd';
import schema from '../../../modules/rings/schema';

function DetailBlock({LIST={},actions={}}) {
  let { items=[],loading } = LIST
  const item = items[0] || {}
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
      <Card title="Ring Chart">
        TODO Chart
      </Card>
      <Card title="Ring Infomation" loading={loading}>
        {
          schema.map((field,index)=>
            <div className="row pb10" key={index}>
              <div className="col-1 color-grey-700">{field.title}</div>
              <div className="col color-grey-700 text-left">
                {renders[field.name] &&  renders[field.name](item[field.name],item)}
                {!renders[field.name] && item[field.name]}
              </div>
            </div>
          )
        }
      </Card>
    </div>
  );
}

export default DetailBlock;
