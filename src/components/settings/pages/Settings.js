import React from 'react';
import {Tabs} from 'antd'
import Settings from '../components'
import SettingsContainer from '../../../modules/settings/container'
import intl from 'react-intl-universal';

const SettingPage = ({modal}) => {

  return (
      <div className="bg-white" style={{borderRadius:'10px'}}>
          <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('settings.preference')}</div>} key="preference">
              <SettingsContainer>
                <Settings.Preference />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">{intl.get('settings.trade')}</div>} key="trading">
              <SettingsContainer>
                <Settings.Trading />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">{intl.get('settings.relay')}</div>} key="relay">
              <SettingsContainer>
                <Settings.Relay modal={modal} />
              </SettingsContainer>
            </Tabs.TabPane>
          </Tabs>
      </div>
  )
}
export default SettingPage
