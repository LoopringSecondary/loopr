import React from 'react';
import { Button,Icon } from 'antd'
import { connect } from 'dva'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import intl from 'react-intl-universal'
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
  }
  // playbackRate="0.5"
  return (
    <Layout {...props}>
      <video id="homeVideo" style={{position:'absolute',width:'100%'}} src="http://7xq5ip.com1.z0.glb.clouddn.com/377200.mp4" width="100%" autoPlay="true" loop />
      <div  style={{position:'absolute',width:'100vw',height:'100vh',background:'rgba(0,0,0,0.65)'}} />
      {
        false &&
        <iframe style={{position:'absolute'}} src="http://7xq5ip.com1.z0.glb.clouddn.com/377200.mp4" width="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      }
      {
        true &&
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
      }

    </Layout>
  )
}
export default connect()(Home)
