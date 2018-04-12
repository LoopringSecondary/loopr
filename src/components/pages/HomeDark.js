import React from 'react';
import { Button,Icon } from 'antd'
import { connect } from 'dva'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import intl from 'react-intl-universal'
import Notification from 'Loopr/Notification'
import VedioBackGroud from 'react-background-video-player'

function Home(props){
  const { children,dispatch } = props
  const showModal = (id)=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:id,
        pageFrom:'Portfolio',
        visible:true,
      }
    })
    Notification.open({
      duration:0,
      message:intl.get('home.beta_notification_title'),
      description:intl.get('home.beta_notifycation_content'),
      type:'info'
    })
  }
  // playbackRate="0.5"
  return (
    <Layout {...props}>
      <VedioBackGroud src="http://7xq5ip.com1.z0.glb.clouddn.com/backgound_video_720_10.mov" containerWidth={ window.innerWidth} containerHeight={window.innerHeight}/>
      <div style={{position:'absolute',width:'100vw',height:'100vh',background:'rgba(0,0,0,0.65)'}} />
      <div className="position-absolute text-center d-flex align-items-center justify-content-center" style={{height:'100vh',width:'100%'}}>
       <div className="" style={{letterSpacing:'0.1rem',wordSpacing:'0.2rem'}}>
         <div className="fs40 color-white mb20">{intl.get('home.title')}</div>
         <div className="fs24 color-white-1 mb20">{intl.get('home.subtitle')}</div>
        {
          !(window.WALLET && window.WALLET.getAddress()) &&
          <div className="">
            <Button onClick={showModal.bind(this,'wallet/unlock')} className="m15" style={{width:'255px'}} type="primary" size="large">{intl.get('buttons.unlock_wallet')}</Button>
            <Button onClick={showModal.bind(this,'wallet/demo')} className="m15" style={{width:'255px'}} type="" size="large">{intl.get('buttons.try_demo')}</Button>
          </div>
        }
       </div>
       <div className="position-absolute w-100" style={{bottom:'0px'}}>
        <Sockets.TickersByLoopring>
         <Market.TickerCarousel />
        </Sockets.TickersByLoopring>
       </div>
      </div>
    </Layout>
  )
}
export default connect()(Home)
