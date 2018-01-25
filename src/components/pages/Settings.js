import React from 'react';
import { Tabs,Card,Modal } from 'antd'
import { connect } from 'dva'
import Settings from '../settings/components'
import SettingsContainer from '../../modules/settings/container'
import ModalContainer from '../../modules/modals/container'

const SettingPage = (props) => {
  const { modals,dispatch } = props
  const id='setting'
  let thisModal = modals[id] || {}
  const hideModal = (payload)=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:id,
        visible:false,
      }
    })
  }
  const modalProps = {
    visible:thisModal.visible,
    title:thisModal.title || 'Setting',
    footer:null,
    closable:true,
    maskClosable:true,
    wrapClassName:"rs",
    onCancel:hideModal,
  }
  return (
    <Modal {...modalProps}>
      <div className="bg-white">
          <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs16">Preference</div>} key="preference">
              <div className="p15 pl0 pr0">
                <SettingsContainer>
                  <Settings.Preference />
                </SettingsContainer>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
              <div className="p15 pl0 pr0">
                <Settings.Trading/>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
              <div className="p15 pl0 pr0">
                <Settings.Relay/>
              </div>
            </Tabs.TabPane>
          </Tabs>
      </div>
    </Modal>
    
  )
}

export default connect(({modals})=>({modals}))(SettingPage)
