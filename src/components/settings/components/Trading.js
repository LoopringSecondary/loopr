import React from 'react';
import {Button, Form, Input, Select, Slider} from 'antd';
import {configs} from '../../../common/config/data'
import intl from 'react-intl-universal';

const TradingSettingForm = ({
    settings,form
  }) => {
  const {trading} = settings
  const integerReg = new RegExp("^0*[1-9]{1}[0-9]*$")
  function handleChange(type, e) {
    if ('timeToLive' === type || 'lrcFee' === type || 'marginSplit' === type) {
      handleChangeValue(type, e.target.value)
    } else {
      handleChangeValue(type, e)
    }
  }
  function handleChangeValue(type, v) {
    if ("contractVersion" === type){
      const address = configs.contracts.find(item => item.version === v)
      if(address) {
        settings.tradingChange({contract:{version:v, address:address.address}})
      } else {
        console.error("error")
      }
    } else if('timeToLive' === type){
      if(validateInteger(v)) {
        settings.tradingChange({[type]:v})
      }
    } else if('timeToLiveUnit' === type) {
      settings.tradingChange({[type]:v})
    } else if ('gasPrice' === type) {
      if (validateGasPrice(v)) {
        settings.tradingChange({[type]:v})
      }
    } else {
      if (('lrcFee' === type && validateLrcFee(v))
        || ('marginSplit' === type && validateMarginSplit(v))){
        settings.tradingChange({[type]:v})
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
    const latestContract = configs.contracts[configs.contracts.length-1]
    form.setFieldsValue({contractVersion:latestContract.version, timeToLive:configs.defaultExpireTime, timeToLiveUnit:configs.defaultExpireTimeUnit,
      lrcFee:configs.defaultLrcFeePermillage, marginSplit:configs.defaultMarginSplitPercentage, gasPrice:configs.defaultGasPrice})
    handleChangeValue('contractVersion', latestContract.version)
    handleChangeValue('timeToLive', configs.defaultExpireTime)
    handleChangeValue('timeToLiveUnit', configs.defaultExpireTimeUnit)
    handleChangeValue('lrcFee', configs.defaultLrcFeePermillage)
    handleChangeValue('marginSplit', configs.defaultMarginSplitPercentage)
    handleChangeValue('gasPrice', configs.defaultGasPrice)
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
      <Option value="minute">{intl.get('trade.minute')}</Option>
      <Option value="hour">{intl.get('trade.hour')}</Option>
      <Option value="day">{intl.get('trade.day')}</Option>
      <Option value="week">{intl.get('trade.week')}</Option>
      <Option value="month">{intl.get('trade.month')}</Option>
    </Select>
  )

  const contractVersionExtra = <div className="fs10 mt5"><a target="_blank" href={"https://etherscan.io/address/"+trading.contract.address}>{trading.contract.address}</a></div>

  return (
    <div className="" >
      <Form layout="horizontal" className="p15">
        {
          false &&
            <Form.Item {...formItemLayout} label={intl.get('settings.contract')} colon={false} extra={contractVersionExtra}>
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
        }
        <Form.Item {...formItemLayout} label={intl.get('settings.ttl')} colon={false}>
          {form.getFieldDecorator('timeToLive', {
            initialValue:trading.timeToLive,
            rules:[
              {
                message:intl.get("settings.ttl_tip"),
                validator: (rule, value, cb) => validateInteger(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter={timeToLiveSelectAfter} onChange={handleChange.bind(this, "timeToLive")}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={intl.get('settings.lrcfee')} colon={false}>
          {form.getFieldDecorator('lrcFee', {
            initialValue:trading.lrcFee,
            rules:[
              {message: intl.get("settings.ttl_tip").concat('(0~50)') ,
                validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter="‰" onChange={handleChange.bind(this, "lrcFee")}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={intl.get('settings.margin')} colon={false}>
          {form.getFieldDecorator('marginSplit', {
            initialValue:trading.marginSplit,
            rules:[
              {message: intl.get("settings.ttl_tip").concat('(0~100)'),
                validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" addonAfter="％" onChange={handleChange.bind(this, "marginSplit")}/>
          )}
        </Form.Item>
        <Form.Item label={intl.get('settings.gasPrice')+':  '+ trading.gasPrice+" Gwei"} colon={false} className="mb5">
          {form.getFieldDecorator('gasPrice', {
            initialValue:Number([trading.gasPrice]),
            rules:[]
          })(
            <Slider min={1} max={99} step={1} onChange={handleChange.bind(this, "gasPrice")}
              marks={{
                1: intl.get('settings.slow') ,
                99: intl.get('settings.fast') ,
              }}
            />
          )}
        </Form.Item>
      </Form>
      <div className="p15 zb-b-t text-right">
        <Button onClick={handleReset} type="" className="">{intl.get('settings.reset')} </Button>
      </div>
    </div>
  );
};


export default Form.create()(TradingSettingForm);


