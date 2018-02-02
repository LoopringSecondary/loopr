import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const TradingSettingForm = ({
    settings,form
  }) => {

  const {trading} = settings

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
      <Form layout="horizontal" className="p15">
        <Form.Item {...formItemLayout} label="Contract Version" colon={false}>
          {form.getFieldDecorator('contractVersion', {
            initialValue:'v1.0',
            rules:[]
          })(
            <Select
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
            >
              {[1,1,1,1].map((item,index)=>
                <Select.Option key={index} value={'v1.0'} >V1.0</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="LRC Fee" colon={false}>
          {form.getFieldDecorator('lrcFee', {
            initialValue:'2',
            rules:[
              {required: true, message: 'Input valid integer value (0~50).',
                validator: (rule, value, cb) => {
                  let v = Number(value);
                  return value && v.toString() === value && v >=0 && v <=50 ? cb() : cb(true)
                }
              }
            ]
          })(
            <Input size="large" addonAfter="‰"/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Margin Split" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:'50',
            rules:[
              {required: true, message: 'Input valid integer value (0~100).',
                validator: (rule, value, cb) => {
                  let v = Number(value);
                  return value && v.toString() === value && v >=0 && v <=100 ? cb() : cb(true)
                }
              }
            ]
          })(
            <Input size="large" addonAfter="％"/>
          )}
        </Form.Item>
        <Form.Item label={"Gas Price: "+[trading.gasPrice]+" Gwei"} colon={false} className="mb5">
          {form.getFieldDecorator('gasPrice', {
            initialValue:Number([trading.gasPrice]),
            rules:[]
          })(
            <Slider min={1} max={99} step={1}
              marks={{
                1: 'Slow',
                99: 'Fast',
              }}
              onChange={(value)=> {
                trading.gasPrice = value
              }}
            />
          )}
        </Form.Item>
      </Form>
      <div className="p15 zb-b-t text-right">
        <Button onClick={handleReset} type="" className="">Reset</Button>
      </div>
    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(TradingSettingForm));


