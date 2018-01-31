import React from 'react';
import { Button,Icon } from 'antd'
import { connect } from 'dva'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
import Wallet from '../wallet/components'
import ModalContainer from '../../modules/modals/container'

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
  const MarkItem = (props)=>{
    return (
      <div className="p15 text-left" style={{background:'#0077FF'}}>
        <div className="fs16">
          <span className="color-white mr5">LRC/ETH</span>
          <span className="" style={{color:'#00E831'}}>
            <Icon type="arrow-up" />10.5%
          </span>
        </div>
        <div className="fs18">
          <span className="color-white mr5">0.003</span>
          <span className="color-white" style={{opacity:'0.6'}}>ETH</span>
        </div>

      </div>
    )
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
       <div className="position-absolute row no-gutters mb0 w-100" style={{bottom:'0px'}}>
         {
          Array(6).fill(1).map((item,index)=>
            <div className="col" key={index}>
              <MarkItem key={index} item={item} />
            </div>
          )
         }
       </div>
      </div>
      <ModalContainer id="wallet/unlock" >
        <Wallet.UnlockWallet />
      </ModalContainer>
      <ModalContainer id="wallet/generate" >
        <Wallet.GenerateWallet />
      </ModalContainer>
      <ModalContainer id="wallet/backup" >
        <Wallet.BackupWallet />
      </ModalContainer>
    </Layout>
  )
}
export default connect()(Home)