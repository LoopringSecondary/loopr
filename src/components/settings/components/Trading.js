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
      <Form layout="horizontal" className="">
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
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button onClick={handleReset} type="" className="">Reset</Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create()(TradingSettingForm);


