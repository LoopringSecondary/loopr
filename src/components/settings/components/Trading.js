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
        <Form.Item {...formItemLayout} label="Contract Version" colon={false}>
          {form.getFieldDecorator('contractVersion', {
            initialValue:'v1.0',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
            >
              {[1,1,1,1].map((item,index)=>
                <Select.Option value={'v1.0'} >V1.0</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="LRC Fee" colon={false}>
          {form.getFieldDecorator('lrcFee', {
            initialValue:'2',
            rules:[]
          })(
            <Input size="large" addonAfter="‰"/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Margin Split" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:'50',
            rules:[]
          })(
            <Input size="large" addonAfter="％"/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Gas Price" colon={false}>
          {form.getFieldDecorator('gasPrice', {
            initialValue:'30',
            rules:[]
          })(
            <Slider min={10} max={80} step={10} 
              marks={{
                10: 'Slow',
                30: '30',
                40: '40',
                50: '50',
                60: '60',
                80: 'Fast',
              }} 
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Custom Token" colon={false}>
          {form.getFieldDecorator('customTokens', {
            initialValue:'',
            rules:[]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item className="mt-auto">
          <div className="row">
            <div className="col">
              <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Save</Button>
            </div>
            <div className="col">
              <Button onClick={handleReset} type="" className="d-block w-100" size="large">Reset</Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create()(TradingSettingForm);


