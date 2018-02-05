import React from 'react';
import { Tabs,Card,Modal } from 'antd'
import { connect } from 'dva'
import Settings from '../components'
import SettingsContainer from '../../../modules/settings/container'

const SettingPage = ({modal}) => {

  return (
      <div className="bg-white" style={{borderRadius:'10px'}}>
          <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">Preference</div>} key="preference">
              <SettingsContainer>
                <Settings.Preference />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
              <SettingsContainer>
                <Settings.Trading />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
              <SettingsContainer>
                <Settings.Relay modal={modal} />
              </SettingsContainer>
            </Tabs.TabPane>
          </Tabs>
      </div>
  )
}
export default SettingPage
