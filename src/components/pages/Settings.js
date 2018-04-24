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
    title:thisModal.title || null,
    footer:null,
    closable:true,
    maskClosable:true,
    // wrapClassName:"rs",
    onCancel:hideModal,
  }
  return (
    <Modal {...modalProps} className="rs-body">
      <div className="bg-white" style={{borderRadius:'10px'}}>
          <Tabs defaultActiveKey="preference" animated={false} tabBarStyle={{marginBottom:'0px'}}>
            <Tabs.TabPane tab={<div className="fs16">Preference</div>} key="preference">
              <div className="p15 pt25">
                <SettingsContainer>
                  <Settings.Preference />
                </SettingsContainer>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Trading</div>} key="trading">
              <div className="p15 pt25">
                <SettingsContainer>
                  <Settings.Trading/>
                </SettingsContainer>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="fs18 pb5 pt5">Relay</div>} key="relay">
              <div className="p15 pt25">
                <SettingsContainer>
                  <Settings.Relay/>
                </SettingsContainer>
              </div>
            </Tabs.TabPane>
          </Tabs>
      </div>
    </Modal>

  )
}

export default connect(({modals})=>({modals}))(SettingPage)
