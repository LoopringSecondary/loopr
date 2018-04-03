import React from 'react';
import { Button } from 'antd'
import Notification from 'Loopr/Notification'
import PagesExample from 'Loopr/PagesExample'

function Test(props){
  const notify = ()=>{
    Notification.success({
      duration:null,
      message:'This is Title',
      description:'This is Description',
    })
  }
  return (
    <div className="container p30">
      <Button onClick={notify}>Notify</Button>
      <PagesExample />
    </div>
  )
}

export default Test
