import React from 'react';
import { Button } from 'antd'
import Notification from 'Loopr/Notification'
import PagesExample from 'Loopr/PagesExample'

function Test(props){
  const notifySuccess1 = ()=>{
    Notification.open({
      duration:0,
      message:'Copy Success!',
      type:'success',
      size:'small'
    })
  }
  const notifySuccess = ()=>{
    Notification.open({
      // duration:4.5,
      duration:0,
      message:'Place order success !',
      description:'Your order will be filled from now on !',
      type:'success',
    })
  }

  const notifyWarning = ()=>{
    Notification.open({
      duration:0,
      message:"Order can not be fully filled !",
      description:'You need 3.2 LRC for order.',
      type:'warning',
      actions:(
        <div>
          <Button className="alert-btn mr5">Buy LRC</Button>
          <Button className="alert-btn mr5">Receive LRC</Button>
        </div>
      )

    })
  }
  const notifyWarning2 = ()=>{
    Notification.open({
      duration:0,
      message:"Order can not be fully filled !",
      description:'You need 3.2 WETH for order.',
      type:'warning',
      actions:(
        <div>
          <Button className="alert-btn mr5">Convert ETH To WETH</Button>
        </div>
      )

    })
  }

  const notifyError = ()=>{
    Notification.open({
      duration:0,
      message:"Place order failed !",
      description:'You need 0.45+ LRC for order fee.',
      type:'error',
      actions:(
        <div>
          <Button className="alert-btn mr5">Buy LRC</Button>
          <Button className="alert-btn mr5">Receive LRC</Button>
        </div>
      )

    })
  }
  const notifyError2 = ()=>{
    Notification.open({
      duration:0,
      message:"Place order failed !",
      description:'You need 0.003+ ETH for order gas .',
      type:'error',
      actions:(
        <div>
          <Button className="alert-btn mr5">Receive ETH</Button>
        </div>
      )

    })
  }
  const notifyInfo = ()=>{
    Notification.open({
      duration:0,
      message:"Transaction is pending",
      description:'Wait for tx to be success',
      type:'info',
      actions:(
        <div>
          <Button className="alert-btn mr5">View transaction in etherscan.io</Button>
        </div>
      )

    })
  }
  return (
    <div className="container p30">
      <Button className="m5" onClick={notifySuccess1}>Notify Success1</Button>
      <Button className="m5" onClick={notifySuccess}>Notify Success</Button>
      <Button className="m5" onClick={notifyWarning}>Notify Waring</Button>
      <Button className="m5" onClick={notifyWarning2}>Notify Waring2</Button>
      <Button className="m5" onClick={notifyError}>Notify Error</Button>
      <Button className="m5" onClick={notifyError2}>Notify Error2</Button>
      <Button className="m5" onClick={notifyInfo}>Notify Info</Button>
      <PagesExample />
    </div>
  )
}

export default Test
