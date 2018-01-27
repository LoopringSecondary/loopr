import React from 'react';
import { Button,Icon } from 'antd'
import { Route } from 'dva/router'

export default function Home(props){
  const { children } = props
  return (
   <div className="text-center d-flex align-items-center justify-content-center" style={{height:'600px'}}>
    <div className="">
      <div className="fs40 color-grey-900 mb10">Welcome To Loopring Wallet</div>
      <div className="fs20 color-grey-500 mb10">Secure token trading from your own wallet</div>
      <div className="">
        <Button className="m15" style={{width:'200px'}} type="primary" size="large">Unlock Wallet</Button>
        <Button className="m15" style={{width:'200px'}} type="" size="large">Generate Wallet</Button>  
      </div>
    </div>
     
   </div>
  )
}