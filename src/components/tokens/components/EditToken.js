import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Card} from 'antd';

const AddCustomToken = ({
    form
  }) => {
  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  return (
    <Card title="Edit Custom Token" className="" >
      <Form layout="horizontal" className="">
        <Form.Item label="Token Name" colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:'',
            rules:[]
          })(
            <Input size="large"/>
          )}
        </Form.Item>
        <Form.Item label="Token Contract Address" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:'',
            rules:[]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <div className="row">
        	<div className="col">
	        	<Form.Item label="Token Symbol" colon={false}>
	        	  {form.getFieldDecorator('symbol', {
	        	    initialValue:'',
	        	    rules:[]
	        	  })(
	        	    <Input size="large"/>
	        	  )}
	        	</Form.Item>
        	</div>
        	<div className="col">
	        	<Form.Item label="Decimals" colon={false}>
	        	  {form.getFieldDecorator('decimals', {
	        	    initialValue:'',
	        	    rules:[]
	        	  })(
	        	    <Input size="large"/>
	        	  )}
	        	</Form.Item>
        	</div>

        </div>
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button onClick={handleSubmit} type="primary" className="d-block w-100 mb15" size="large">
              	Save
              </Button>
              <Button onClick={handleSubmit} type="" className="d-block w-100 bg-red-600 border-0" size="large">
              	Delete
              </Button>

            </div>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};


export default Form.create()(AddCustomToken);


