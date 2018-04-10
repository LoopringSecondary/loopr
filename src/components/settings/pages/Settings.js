import React from 'react';
import {Tabs,Card} from 'antd'
import Settings from '../components'
import SettingsContainer from '../../../modules/settings/container'
import intl from 'react-intl-universal';

const SettingPage = ({modal}) => {

  return (
      <Card title={<div className="fs1">{intl.get('navbar.settings')}</div>} className="bg-white settings-card" style={{borderRadius:'10px'}}>
          <Tabs className="no-ink-bar setting-tabs" defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px',textAlign:'left'}}>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('settings.preference')}</div>} key="preference">
              <SettingsContainer>
                <Settings.Preference />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('settings.trade')}</div>} key="trading">
              <SettingsContainer>
                <Settings.Trading />
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs16 pb5 pt5">{intl.get('settings.relay')}</div>} key="relay">
              <SettingsContainer>
                <Settings.Relay modal={modal} />
              </SettingsContainer>
            </Tabs.TabPane>
          </Tabs>
      </Card>
  )
}
export default SettingPage
