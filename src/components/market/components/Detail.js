import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,ListItem } from 'antd';
import schema from '../../../modules/orders/schema';

function DetailBlock({LIST={},actions={}}) {
  let { items=[],loading } = LIST
  const item = items[0] || {}
  const renders = {
      orderHash:(value,item,index)=><Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/orders/detail/${value}`}>{value}</Link>,
      status:(value,item,index)=>value,
  }
  return (
    <div className="">
      <Card title="Order Detail" loading={loading}>
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
