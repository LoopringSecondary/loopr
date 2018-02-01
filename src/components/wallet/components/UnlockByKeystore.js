import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Upload,Icon,message,Alert } from 'antd';


function UnlockByKeyStore({form}) {
	const uploadProps = {
	  name: 'file',
	  action: '//jsonplaceholder.typicode.com/posts/',
	  headers: {
	    authorization: 'authorization-text',
	  },
	  onChange(info) {
	    if (info.file.status !== 'uploading') {
	      console.log(info.file, info.fileList);
	    }
	    if (info.file.status === 'done') {
	      message.success(`${info.file.name} file uploaded successfully`);
	    } else if (info.file.status === 'error') {
	      message.error(`${info.file.name} file upload failed.`);
	    }
	  },
	};
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
       <Form.Item label="Select Your Keystore File" colon={false}>
         {form.getFieldDecorator('keystore', {
           initialValue:'',
           rules:[]
         })(
         	<Upload {...uploadProps}>
         	    <Button>
         	      <Icon type="upload" /> Select JSON File
         	    </Button>
         	  </Upload>
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
     <Button type="primary" className="d-block w-100" size="large">UnLock</Button>
    </div>
  )
}

export default Form.create()(UnlockByKeyStore)
