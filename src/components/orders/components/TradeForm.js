import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse} from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'

let TradeForm = ({
  form,
  side='sell',
  pair='LRC-WETH',
  dispatch,
  }) => {
  const tokenL = pair.split('-')[0].toUpperCase()
  const tokenR = pair.split('-')[1].toUpperCase()
  //TODO mock data
  const tokenLBalance = {...window.CONFIG.getTokenBySymbol(tokenL), balance: 100.00, allowance: 0}
  const tokenRBalance = {...window.CONFIG.getTokenBySymbol(tokenL), balance: 321.00, allowance: 0}
  const marketConfig = window.CONFIG.getMarketBySymbol(tokenL, tokenR)

  const showTradeModal = ()=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:'trade/confirm',
        visible:true,
        side,
        pair,
      }
    })
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
        showTradeModal()
      }
    });
  }
  function handleCancle() {
  }
  function handleReset() {
    form.resetFields()
  }
  function validateAmount(value) {
    const price = form.getFieldValue("price")
    if(price > 0) {
      if(side === 'sell') {
        return value && value <= tokenLBalance.balance
      } else {
        return value && (price * value) <= tokenRBalance.balance
      }
    } else {
      return true
    }
  }
  function validatePirce(value) {
    return value >0
  }
  function validateLrcFee(value) {
    return value && value > 0 && value <= 50
  }
  function validateMarginSplit(value) {
    return value >= 0 && value <= 100
  }
  function inputChange(type, e) {
    let price = 0, amount = 0
    if(type === 'price') {
      price = e.target.value.toString()
      const priceArr = price.split(".")
      if(priceArr[1] && priceArr[1].length > marketConfig.pricePrecision) {
        price = Number(priceArr[0]+"."+priceArr[1].substring(0, marketConfig.pricePrecision))
        e.target.value = price
      }
      amount = form.getFieldValue("amount")
    } else if(type === 'amount') {
      amount = e.target.value.toString()
      const amountPrecision = tokenLBalance.precision - marketConfig.pricePrecision
      if(amountPrecision >0){
        const amountArr = amount.split(".")
        if(amountArr[1] && amountArr[1].length > amountPrecision) {
          amount = Number(amountArr[0]+"."+amountArr[1].substring(0, amountPrecision))
        }
      } else {
        amount = Math.floor(amount)
      }
      e.target.value = amount
      price = form.getFieldValue("price")
    }
    form.setFieldsValue({"total": price*amount})
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  const Option = Select.Option;
  const timeToLiveSelectAfter = (
    <Select defaultValue="second" style={{ width: 90 }}>
      <Option value="second">Second</Option>
      <Option value="minute">Minute</Option>
      <Option value="hour">Hour</Option>
      <Option value="day">Day</Option>
    </Select>
  );
  return (
      <div>
        <Form layout="horizontal">
          <Form.Item >
            <div className="row">
              <div className="col fs18 color-grey-900 text-capitalize">{side} {tokenL}</div>
              <div className="col-auto">
                {
                  side === 'buy' ? `${tokenR} Balance: ${tokenRBalance.balance}` : `${tokenL} Balance: ${tokenLBalance.balance}`
                }
              </div>
            </div>

          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('amount', {
              initialValue:0,
              rules:[{
                message: 'Please input valid amount', transform:(value)=>fm.toNumber(value),
                validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
              }]
            })(
              <Input placeholder="" size="large" suffix={tokenL} onChange={inputChange.bind(this, 'amount')}
                     onFocus={() => {
                const amount = form.getFieldValue("amount")
                if(amount === 0) {
                  form.setFieldsValue({"amount": ''})
                }
              }}
                     onBlur={() => {
                const amount = form.getFieldValue("amount")
                if(amount === '') {
                  form.setFieldsValue({"amount": 0})
                }
              }}/>
            )}
          </Form.Item>
          <Form.Item label="Price" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('price', {
              initialValue:0,
              rules:[{
                message: 'Please input valid price', transform:(value)=>fm.toNumber(value),
                validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={tokenR} onChange={inputChange.bind(this, 'price')}
                     onFocus={() => {
                const amount = form.getFieldValue("price")
                if(amount === 0) {
                  form.setFieldsValue({"price": ''})
                }
              }}
                     onBlur={() => {
                const amount = form.getFieldValue("price")
                if(amount === '') {
                  form.setFieldsValue({"price": 0})
                }
              }}/>
            )}
          </Form.Item>
          <Form.Item className="mb5" label="Total" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('total', {
              initialValue:0,
              rules:[]
            })(
              <Input disabled className="d-block w-100" placeholder="" size="large" suffix={tokenR}/>
            )}
          </Form.Item>
          <Collapse bordered={false} defaultActiveKey={[]}>
            <Collapse.Panel className="" style={{border:'none',margin:'0px -15px',padding:'0px -15px'}} header={<div style={{}}>Advanced</div>} key="1">
              <div className="row">
                <div className="col-12">
                  <Form.Item className="mb5" label="Time to live">
                    {form.getFieldDecorator('timeToLive', {
                      rules:[{type:'integer', message:"Please input integer value",
                        transform:(value)=>fm.toNumber(value)}]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" addonAfter={timeToLiveSelectAfter}/>
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item className="mb5" label="Lrc Fee">
                    {form.getFieldDecorator('lrcFee', {
                      rules:[{type : 'integer', message:"Please input valid integer value(1~50)",
                        transform:(value)=>fm.toNumber(value), validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)}]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" suffix='‰'/>
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item className="mb5" label="MarginSplit">
                    {form.getFieldDecorator('marginSplit', {
                      rules:[{type : 'integer', message:"Please input valid integer value(0~100)",
                        transform:(value)=>fm.toNumber(value), validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)}]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large"  suffix='％'/>
                    )}
                  </Form.Item>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
          <Form.Item >
            {
              side == 'buy' &&
              <Button onClick={handleSubmit} type="" className="d-block w-100 bg-red-500 border-none color-white" size="large">
                Place Order
              </Button>
            }
            {
              side == 'sell' &&
              <Button onClick={handleSubmit} type="" className="d-block w-100 bg-green-500 border-none color-white" size="large">
                Place Order
              </Button>
            }
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(connect()(TradeForm));


