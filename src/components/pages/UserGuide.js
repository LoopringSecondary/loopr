import React from 'react';
import { Tabs,Card,Modal,Steps } from 'antd'
import { connect } from 'dva'
import Settings from '../settings/components'
import SettingsContainer from '../../modules/settings/container'
import ModalContainer from '../../modules/modals/container'
import intl from 'react-intl-universal'

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
    <Card
      title={<div className="pl15 pr15">用户指南</div>}
      className="rs-p0"
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="开始交易" key="1">
          <div className="p10">
            <Steps direction="vertical">
              <Steps.Step status="process" title={"进入：钱包页"} description={
                <div className="fs12 color-black-3">默认看到 ETH 资产信息</div>
              } />
              <Steps.Step status="process" title={"进入：资产页"} description={
                  <div className="fs12 color-black-3">例如：选择左侧资产列表的LRC，看到LRC资产信息</div>
              }/>
              <Steps.Step status="process" title={"进入：交易页"} description={
                  <div className="fs12 color-black-3">例如：点击LRC资产页右上角的 买卖LRC 按钮</div>
              }/>
              <Steps.Step status="process" title={"返回：钱包页"} description={
                  <div className="fs12 color-black-3">点击左上角安按钮，返回钱包页</div>
              }/>

            </Steps>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="路印交易专家" key="2" disabled>
          常见问题
        </Tabs.TabPane>
        <Tabs.TabPane tab="常见问题" key="3" disabled>
          常见问题
        </Tabs.TabPane>
        <Tabs.TabPane tab="常见概念" key="4" disabled>
          常见问题
        </Tabs.TabPane>
      </Tabs>

    </Card>
  )
}

export default connect(({modals})=>({modals}))(SettingPage)
