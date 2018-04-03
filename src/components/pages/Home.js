import React from 'react';
import { Button,Icon } from 'antd'
import { connect } from 'dva'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import intl from 'react-intl-universal'
import {Pages,Page} from 'Loopr/Pages'

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

  return (
    <Layout {...props}>
      <div className="position-relative bg-white text-center d-flex align-items-center justify-content-center" style={{height:'100vh'}}>
       <div className="" style={{letterSpacing:'0.1rem',wordSpacing:'0.2rem'}}>
         <div className="fs40 color-grey-900 mb10">{intl.get('home.title')}</div>
         <div className="fs24 color-grey-500 mb10">{intl.get('home.subtitle')}</div>
        {
          !(window.WALLET && window.WALLET.getAddress()) &&
          <div className="">
            <Button onClick={showModal.bind(this,'wallet/unlock')} className="m15" style={{width:'255px'}} type="primary" size="large">{intl.get('buttons.unlock_wallet')}</Button>
            <Button onClick={showModal.bind(this,'wallet/generate')} className="m15" style={{width:'255px'}} type="" size="large">{intl.get('buttons.generate_wallet')}</Button>
          </div>
        }
        <Pages active="1">
          <Page id="1" render={({page})=>{
            return (
              <div className="fs14">
                First Page
                <Button onClick={page.gotoPage.bind(this,{id:'2'})} className="m15" type="" size="small">Go To 2</Button>
              </div>
            )
          }} />
          <Page id="2" render={({page})=>{
            return (
              <div className="fs14">
                Second Page
                <Button onClick={page.gotoPage.bind(this,{id:'3'})} className="m15" type="" size="small">Go To 3</Button>
              </div>
            )
          }} />
          <Page id="3" render={({page})=>{
            return (
              <div className="fs14">
                Third Page
                <Button onClick={page.gotoPage.bind(this,{id:'1'})} className="m15" type="" size="small">Go To 1</Button>
              </div>
            )
          }} />


        </Pages>
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
