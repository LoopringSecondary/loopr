import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const TradingSettingForm = ({
    settings,form
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
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };


  return (
    <div className="" >
      <Form layout="horizontal" style={{height:'420px'}} className="d-flex flex-column preference-form">
        <Form.Item label="Choose Relay" colon={false}>
          {form.getFieldDecorator('relay', {
            initialValue:{},
            rules:[]
          })(
            <Radio.Group className="">
              {
                [1,2,3].map((item,index)=>
                  <Radio className="d-flex align-items-center mb15 w-100" value={item} key={index}>
                    <div className="ml10">
                      <div className="row align-items-center">
                        <div className="col">
                          <Input size="large" />
                        </div>
                        <div className="col">
                          <Input size="large" />
                        </div>
                        <div className="col-auto">
                          <Button type="" icon="edit" shape="circle" size=""></Button>
                        </div>
                      </div>
                    </div>
                  </Radio>
                )
              }
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button type="primary" className="d-block w-100" size="large">Add Cutom Relay</Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create()(TradingSettingForm);


