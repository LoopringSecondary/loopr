import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Card} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const RelayEditForm = ({
    form, modal
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
    })
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  return (
    <Card title="Edit Relay">
      <Form layout="horizontal" className="">
        <Form.Item label="Relay Name" colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:'',
            rules:[]
          })(
            <Input size="large"/>
          )}
        </Form.Item>
        <Form.Item label="Relay URL" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:'',
            rules:[]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <Form.Item className="mb0">
          <Button onClick={handleSubmit} type="primary" className="d-block w-100 mb15" size="large">Save</Button>
          <Button onClick={handleSubmit} type="danger" className="d-block w-100 bg-red-600 border-0 color-white" size="large">Delete</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Form.create()(RelayEditForm);


