import React from 'react';
import { Tabs,Card,Modal } from 'antd'
import { connect } from 'dva'
import Settings from '../components'

const SettingPage = ({modals}) => {

  return (
      <div className="bg-white" style={{borderRadius:'10px'}}>
          <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs16">Preference</div>} key="preference">
              <div className="p15 pt25">
                  <Settings.Preference />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
              <div className="p15 pt25">
                <Settings.Trading />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
              <div className="p15">
                <Settings.Relay modals={modals}  />
              </div>
            </Tabs.TabPane>
          </Tabs>
      </div>
  )
}
export default SettingPage
