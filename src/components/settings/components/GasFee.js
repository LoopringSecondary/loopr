import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio} from 'antd';
import {configs} from '../../../common/config/data'
import intl from 'react-intl-universal';

const GasFeeForm = ({
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
  return (
    <Card className="rs-p0" title={<div className="pl10 pr10">Set Gas Fee</div>} >
      <Form layout="horizontal" className="p15">
        <Radio.Group value={1} className="d-block w-100">
          <Radio value={1} className="d-flex align-items-center mb0 w-100 zb-b-b">
            <div className="ml5 pt10 pb10">
                <div className="fs14 color-black-1">
                  0.000035ETH ≈ $0.35
                </div>
                <div className="fs12 color-black-3">
                  不快不慢，当前网络平均值（系统推荐）
                </div>
            </div>
          </Radio>
          <Radio value={2} className="d-flex align-items-center mb0 w-100 zb-b-b">
            <div className="ml5 pt10 pb10">
                <div className="fs14 color-black-1">
                  0.000055ETH ≈ $0.55
                </div>
                <div className="fs12 color-black-3">
                费用高，时间短（时间优先）
                </div>
            </div>
          </Radio>
          <Radio value={3} className="d-flex align-items-center mb0 w-100 zb-b-b">
            <div className="ml5 pt10 pb10">
                <div className="fs14 color-black-1">
                  0.000015ETH ≈ $0.15
                </div>
                <div className="fs12 color-black-3">
                费用低，时间长（成本优先）
                </div>
            </div>
          </Radio>
          <Radio value={4} className="d-flex align-items-center mb0 w-100 zb-b-b">
            <div className="w-100 row pt10 pb10 m0 gutter-0">
              <div className="col fs14 color-black-2">自定义设置</div>
              <div className="col-auto fs14 color-black-2">
              </div>
            </div>
          </Radio>
        </Radio.Group>

        <div className="zb-b-b">
          <Form.Item label={null} colon={false} className="mb0">
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
          <div className="text-center p10 fs14 color-black-2">
            { intl.get('settings.gasPrice')+':  '+ trading.gasPrice+" Gwei" }
          </div>
        </div>

      </Form>
      <div className="p15 pt0 text-right">
        <Button onClick={handleReset} type="primary" className="">{intl.get('settings.reset')} </Button>
      </div>
    </Card>
  );
};


export default Form.create()(GasFeeForm);


