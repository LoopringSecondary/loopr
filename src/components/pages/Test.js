import React from 'react';
import { Button } from 'antd'
import Notification from 'Loopr/Notification'
import PagesExample from 'Loopr/PagesExample'

function Test(props){
  const notifySuccess = ()=>{
    Notification.open({
      duration:null,
      message:'Place Order Success !',
      description:'Your order has been submited !',
      type:'success',
    })
  }
  const notifyInfo = ()=>{
    Notification.open({
      duration:null,
      message:"Order can not be fully filled !",
      description:'WETH balance is not enough for your order .',
      type:'info',
      actions:(
        <div>
          <Button className="mr5" type="primary">Convert</Button>
          <Button className="mr5" type="primary">Receive</Button>
        </div>
      )

    })
  }
  const notifyWarning = ()=>{
    Notification.open({
      duration:null,
      message:"Order can not be fully filled !",
      description:'WETH balance is not enough for your order .',
      type:'warning',
      actions:(
        <div>
          <Button className="mr5" type="primary">Convert</Button>
          <Button className="mr5" type="primary">Receive</Button>
        </div>
      )

    })
  }
  const notifyError = ()=>{
    Notification.open({
      duration:null,
      message:"Order can not be fully filled !",
      description:'WETH balance is not enough for your order .',
      type:'error',
      actions:(
        <div>
          <Button className="mr5" type="primary">Convert</Button>
          <Button className="mr5" type="primary">Receive</Button>
        </div>
      )

    })
  }
  return (
    <div className="container p30">
      <Button className="m5" onClick={notifySuccess}>Notify Success</Button>
      <Button className="m5" onClick={notifyInfo}>Notify Info</Button>
      <Button className="m5" onClick={notifyWarning}>Notify Waring</Button>
      <Button className="m5" onClick={notifyError}>Notify Error</Button>
      <PagesExample />
    </div>
  )
}

export default Test
