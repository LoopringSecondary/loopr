import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon} from 'antd'
const { Meta } = Card;

const Portfolio = () => {

  const TokenItem = (props)=>{
    const header = (
      <div className="row justify-content-between align-items-center ml0 mr0">
        <div className="col">
          <div>
            <img />
            <span className="color-grey-900 fs20">LRC</span>  
          </div>
        </div>
        <div className="col-auto">
          <div className="color-grey-400">Amount: 15888</div>
        </div>
      </div>
    )
    return (
      <Card bordered title={header}>
        <div className="fs18 color-grey-700 mb5">USD 5343.53</div>
        <div className="row align-items-center ml0 mr0">
          <div className="col">
            <div className="color-green-600 fs14"><Icon type="arrow-up"/> 8.15%</div>
          </div>
          <div className="col-auto">
            <span className="fs10 color-blue-600 mr5">●</span>34.5%
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div style={{width: "80%",margin:"0 auto"}}>
      <div style={{textAlign:"center"}}>
        <h1>TODO</h1>
      </div>
      <div className="row float-right">  </div>
      <div>
        <Row gutter={30}>
          {
            Array(6).fill(1).map((item,index)=>
              <Col span={8} key={index} className="mb15">
                <TokenItem />
              </Col>
            )
          }
        </Row>
      </div>
    </div>
  )
};


export default connect()(Portfolio)
