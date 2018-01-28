import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const AddRelayForm = ({
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
    <div className="" >
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
        <Form.Item className="mt-auto hidden">
          <div className="row">
            <div className="col">
              <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Add Relay</Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create()(AddRelayForm);


