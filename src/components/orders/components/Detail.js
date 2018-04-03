import React from 'react'
import {Link} from 'dva/router'
import {Card, Tabs} from 'antd'
import {toNumber} from "Loopring/common/formatter";
import intl from 'react-intl-universal';
import BasicDetail from './BasicDetail'
import Fills from './Fills'
const TabPane = Tabs.TabPane;
function DetailBlock({modal = {}}) {
  return (
    <Card >
      <Tabs defaultActiveKey="basic" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
        <TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('orders.basic_detail')}</div>} key="basic">
          <BasicDetail modal={modal}/>
        </TabPane>
        <TabPane tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('orders.fill_detail')}</div>} key="fills">
          <Fills modal={modal}/>
        </TabPane>
      </Tabs>
    </Card>

  );
}

export default DetailBlock;
