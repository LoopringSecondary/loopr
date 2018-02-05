import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Card,Row,Col,Icon } from 'antd';
import schema from '../../../../modules/tokens/schema';
import { tokens } from '../../../../common/config/data';

function ListBlock({LIST={},actions,modal}) {
  const {
      // items=[],
      // loading,
      // page={}
  } = LIST
  const items = tokens.slice(0,6)
  const TokenItem = ({item,index})=>{
    const header = (
      <div className="row justify-content-center align-items-center no-gutters">
        <div className="col-auto">
          <img className="mr5 rounded-circle border-grey-300 border" src={item.logo} style={{width:'30px',height:'30px',padding:'5px'}}/>
        </div>
        <div className="col-auto">
          <span className="color-grey-900 fs18">{item.token}</span>
        </div>
        <div className="col">
        </div>
      </div>
    )
    return (
      <Card bordered title={header} className="token-list-card text-left">
        <div className="fs22 color-grey-700 mb5">USD 5343.53</div>
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="fs14 color-grey-500">Amount: {item.balance}</div>
          </div>
          <div className="col"></div>
          <div className="col-auto">
            <div className="fs14 color-green-500">
              <Icon type="arrow-up" />34.5%
            </div>
          </div>
        </div>
      </Card>
    )
  }
  return (
    <Row gutter={30}>
      {
        items.map((item,index)=>
          <Col span={8} key={index} className="mb15">
            <TokenItem item={item} index={index}/>
          </Col>
        )
      }
    </Row>
  )
}

export default ListBlock

