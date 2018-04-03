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

  return (
    <div className="container p30">
      <Button onClick={notifySuccess}>Notify Success</Button>
      <Button onClick={notifyInfo}>Notify Info</Button>
      <PagesExample />
    </div>
  )
}

export default Test
