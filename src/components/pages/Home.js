import React from 'react';
import { Button,Icon } from 'antd'
import { connect } from 'dva'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
import Market from '../market/components'

function Home(props){
  const { children,dispatch } = props
  const showModal = (id)=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:id,
        visible:true,
      }
    })
  }
  

  return (
    <Layout {...props}>
      <div className="position-relative bg-white text-center d-flex align-items-center justify-content-center" style={{height:'100vh'}}>
       <div className="" style={{letterSpacing:'0.1rem',wordSpacing:'0.2rem'}}>
         <div className="fs40 color-grey-900 mb10">Welcome To Loopring Wallet</div>
         <div className="fs24 color-grey-500 mb10">Secure token trading right from your own wallet .</div>
         <div className="">
           <Button onClick={showModal.bind(this,'wallet/unlock')} className="m15" style={{width:'255px'}} type="primary" size="large">Unlock Wallet</Button>
           <Button onClick={showModal.bind(this,'wallet/generate')} className="m15" style={{width:'255px'}} type="" size="large">Generate Wallet</Button>  
         </div>
       </div>
       <Market.TickerCarousel />
      </div>
    </Layout>
  )
}
export default connect()(Home)