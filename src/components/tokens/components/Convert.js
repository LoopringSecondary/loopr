import React from 'react';
import { Form,Avatar,Input,Button} from 'antd';

let Convert = ({form}) => {
	function handleSubmit() {
	  form.validateFields((err,values) => {
	    console.log('values',values);
	    if(!err){
	      // TODO
	      // modal.hideModal('transfer')
	      // modal.showModal('transfer/preview')
	    }
	  });
	}
	const formImemLayout = {
	  labelCol: { span: 7 },
	  wrapperCol: { span: 17 },
	}
  return (
      <div>
        <div className="row">
        	<div className="col-auto">
        		<Avatar size="large" />
        	</div>
        	<div className="col-3">
        		<img src="" alt=""/>
        	</div>
        	<div className="col-auto">
        		<Avatar size="large" />
        	</div>
        </div>
        <Form layout="horizontal">
          <Form.Item label="Recipient" {...formImemLayout}>
            {form.getFieldDecorator('Amount', {
              initialValue:'',
              rules:[]
            })(
              <Input placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item >
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default Form.create()(Convert);

 
