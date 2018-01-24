import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon} from 'antd'
const { Meta } = Card;

const Portfolio = () => {


  return (
    <div style={{width: "80%",margin:"0 auto"}}>
      <div style={{textAlign:"center"}}>
        <h1>TODO</h1>
      </div>

      <div className="row float-right">  </div>
      <div>
        <Row gutter={30}>
          <Col span={8}>
            <Card title={<div><Avatar icon='user' size ="small" className="float-left"/><p className="ml40">LRC</p></div>} bordered={false} extra={<div>Amount:1234567</div>}>
              <div className="fs18">USD 5343.53</div>
              <div className="row align-items-center mt30">
                <div className="col">
                  <div className="color-light-green-a700 fs18" > <Icon type="arrow-up"/> 8.15%</div>
                </div>
                <div className="col-auto">
                  <span className="fs12 color-light-blue-800 mr10"> ● </span>34.5%
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title={<div><Avatar icon='user' size ="small" className="float-left"/><p className="ml40">LRC</p></div>} bordered={false} extra={<div>Amount:1234567</div>}>
              <div className="fs18">USD 5343.53</div>
              <div className="row align-items-center mt30">
                <div className="col">
                  <div className="color-light-green-a700 fs18" > <Icon type="arrow-up"/> 8.15%</div>
                </div>
                <div className="col-auto">
                  <span className="fs12 color-light-blue-800 mr10"> ● </span>34.5%
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title={<div><Avatar icon='user' size ="small" className="float-left"/><p className="ml40">LRC</p></div>} bordered={false} extra={<div>Amount:1234567</div>}>
              <div className="fs18">USD 5343.53</div>
              <div className="row align-items-center mt30">
                <div className="col">
                  <div className="color-light-green-a700 fs18" > <Icon type="arrow-up"/> 8.15%</div>
                </div>
                <div className="col-auto">
                  <span className="fs12 color-light-blue-800 mr10"> ● </span>34.5%
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
};


export default connect()(Portfolio)
