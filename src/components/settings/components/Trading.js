import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import {languagesArray, timezoneArray, configs} from '../../../common/config/data'

const TradingSettingForm = ({
    settings,form
  }) => {
  const {trading} = settings
  const integerReg = new RegExp("^[0-9]*$")
  function handleChange(type, e) {
    if ("contractVersion" === type){
      const address = configs.contracts.find(item => item.version === e)
      if(address) {
        settings.tradingChange({contract:{version:e, address:address.address}})
      } else {
        console.error("error")
      }
    } else if('timeToLive' === type){
      if(validateInteger(e.target.value)) {
        settings.tradingChange({[type]:e.target.value})
      }
    } else if('timeToLiveUnit' === type) {
      settings.tradingChange({[type]:e})
    } else if ('gasPrice' === type) {
      if (validateGasPrice(e)) {
        settings.tradingChange({[type]:e})
      }
    } else {
      if (('lrcFee' === type && validateLrcFee(e.target.value))
        || ('marginSplit' === type && validateMarginSplit(e.target.value))){
        settings.tradingChange({[type]:e.target.value})
      }
    }
  }
  function validateLrcFee(value) {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=50
  }
  function validateMarginSplit(value) {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=100
  }
  function validateGasPrice(value) {
    return value >=0 && value < 100;
  }
  function validateInteger(value) {
    return integerReg.test(value)
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

  const Option = Select.Option;
  const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
    initialValue:trading.timeToLiveUnit,
    rules:[]
  })(
    <Select style={{ width: 90 }} onChange={handleChange.bind(this, "timeToLiveUnit")}>
      <Option value="second">Second</Option>
      <Option value="minute">Minute</Option>
      <Option value="hour">Hour</Option>
      <Option value="day">Day</Option>
    </Select>
  )

  const contractVersionExtra = <div className="fs10 mt5"><a target="_blank" href={"https://etherscan.io/address/"+trading.contract.address}>{trading.contract.address}</a></div>

  return (
    <div className="" >
      <Form layout="horizontal" className="p15">
        <Form.Item {...formItemLayout} label="Contract Version" colon={false} extra={contractVersionExtra}>
          {form.getFieldDecorator('contractVersion', {
            initialValue:trading.contract.version,
            rules:[]
          })(
            <Select
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "contractVersion")}
            >
              {configs.contracts.map((item,index)=>
                <Select.Option key={index} value={item.version} >{item.version}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Time to live" colon={false}>
          {form.getFieldDecorator('timeToLive', {
            initialValue:trading.timeToLive,
            rules:[
              {
                message:"Please input integer value",
                validator: (rule, value, cb) => validateInteger(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter={timeToLiveSelectAfter} onChange={handleChange.bind(this, "timeToLive")}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="LRC Fee" colon={false}>
          {form.getFieldDecorator('lrcFee', {
            initialValue:trading.lrcFee,
            rules:[
              {message: 'Input valid integer value (0~50)',
                validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter="‰" onChange={handleChange.bind(this, "lrcFee")}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Margin Split" colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:trading.marginSplit,
            rules:[
              {message: 'Input valid integer value (0~100)',
                validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter="％" onChange={handleChange.bind(this, "marginSplit")}/>
          )}
        </Form.Item>
        <Form.Item label={"Gas Price: " +trading.gasPrice+" Gwei"} colon={false} className="mb5">
          {form.getFieldDecorator('gasPrice', {
            initialValue:Number([trading.gasPrice]),
            rules:[]
          })(
            <Slider min={1} max={99} step={1} onChange={handleChange.bind(this, "gasPrice")}
              marks={{
                1: 'Slow',
                99: 'Fast',
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


export default Form.create()(TradingSettingForm);


