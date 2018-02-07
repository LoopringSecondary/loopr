import React from 'react';
import {Button, Card, Form, Input} from 'antd';

const AddCustomToken = ({form}) => {
  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){

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
    <Card title="Add Custom Token" className="" >
      <Form layout="horizontal" className="">
        <Form.Item label="Token Contract Address" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:'',
            rules:[]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">
              	Save
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};


export default Form.create()(AddCustomToken);


