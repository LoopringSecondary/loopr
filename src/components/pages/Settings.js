import React from 'react';
import { Tabs,Card } from 'antd'
import Settings from '../settings/components'
import SettingsContainer from '../../modules/settings/container'

const App = (props) => {
  return (
    <div className="row justify-content-center">
      <div className="col-6" style={{height:'500px'}}>
        <Card>
          <Tabs defaultActiveKey="preference" animated={false}>
            <Tabs.TabPane tab={<div className="fs16">Preference</div>} key="preference">
              <SettingsContainer>
                <Settings.Preference/>
              </SettingsContainer>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
              <div className="pt15 pb15 pl20 pr20">
                <Settings.Trading/>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
              <div className="pt15 pb15 pl20 pr20">
                <Settings.Relay/>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
};

export default App
