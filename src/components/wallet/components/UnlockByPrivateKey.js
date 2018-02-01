import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Upload,Icon,message,Alert } from 'antd';


function UnlockByPrivateKey({form,modals}) {
   function handleSubmit(){
    form.validateFields( (err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
        modals.hideModal({id:'wallet/unlock'})
        window.routeActions.gotoPath('wallet')
      }
    });
  }
  return (
    <div className="">
     <Alert 
       message={<div className="color-red-600"><Icon type="exclamation-circle" /> NOT Recommended</div>} 
       description={<div className="color-red-600">This is a NOT recommended way to access your wallet.</div>} 
       type="error" 
       showIcon={false}
       className="mb15" 
     /> 
     <Form layout="horizontal" className="">
       <Form.Item className="" label="Paste Your PrivateKey Here">
         {form.getFieldDecorator('privatekey', {
           initialValue:'',
           rules:[]
         })(
          <Input.TextArea size="large" autosize={{minRows:3,maxRows:6}} />
         )}
       </Form.Item>
       <Form.Item className="" label="password">
         {form.getFieldDecorator('password', {
           initialValue:'',
           rules:[]
         })(
         	<Input size="large" type="password" />
         )}
       </Form.Item>
     </Form> 
     <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">UnLock</Button>
    </div>
  )
}

export default Form.create()(UnlockByPrivateKey)
