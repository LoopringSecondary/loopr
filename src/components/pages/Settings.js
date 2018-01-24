import React from 'react';
import { Tabs } from 'antd'
import Settings from '../settings/components'
import SettingsContainer from '../../modules/settings/container'

const App = (props) => {
  return (
    <div className="row justify-content-center">
      <div className="col-auto zb-b bg-white" style={{height:'500px'}}>
        <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
          <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Preference</div>} key="preference">
            <div className="row no-gutters">
              <div className="col">
                <SettingsContainer>
                  <Settings.Preference/>
                </SettingsContainer>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
            <div className="pt15 pb15 pl20 pr20">
              Trading...
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
            <div className="pt15 pb15 pl20 pr20">
              Relay...
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
};

export default App
