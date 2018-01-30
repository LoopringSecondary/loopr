import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Upload,Icon,message } from 'antd';


function UnLockByKeyStore({form}) {
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
     <Form layout="horizontal" className="">
       <Form.Item label="Keystore File" colon={false}>
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
           initialValue:'1',
           rules:[]
         })(
         	<Input size="large" />
         )}
       </Form.Item>
       <Form.Item className="">
         <Button type="primary" className="d-block w-100" size="large">UnLock</Button>
       </Form.Item>
     </Form> 
    </div>
  )
}

export default Form.create()(UnLockByKeyStore)
