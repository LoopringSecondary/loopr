import React from 'react';
import { Button,Icon } from 'antd'
import { Route } from 'dva/router'
import Layout from '../../layout/Layout'
export default function Home(props){
  const { children } = props
  return (
    <Layout {...props}>
      <div className="bg-white text-center d-flex align-items-center justify-content-center" style={{height:'100vh'}}>
       <div className="" style={{letterSpacing:'0.1rem',wordSpacing:'0.2rem'}}>
         <div className="fs40 color-grey-900 mb10">Welcome To Loopring Wallet</div>
         <div className="fs24 color-grey-500 mb10">Secure token trading right from your own wallet .</div>
         <div className="">
           <Button className="m15" style={{width:'255px'}} type="primary" size="large">Unlock Wallet</Button>
           <Button className="m15" style={{width:'255px'}} type="" size="large">Generate Wallet</Button>  
         </div>
       </div>
      </div>
    </Layout>
    
  )
}