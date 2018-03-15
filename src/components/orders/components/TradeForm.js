import React from 'react';
import {connect} from 'dva';
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse} from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'
import {accAdd, accSub, accMul, accDiv} from '../../../common/Loopring/common/math'
import {configs} from '../../../common/config/data'
import config from '../../../common/config'

class TradeForm extends React.Component {
  state = {
    estimatePriceWorth: 0,
    availableAmount: 0,
    timeToLivePopularSetting: true
  }

  componentDidMount() {
    const {side, pair, assets} = this.props
    if (side === 'sell') {
      const tokenL = pair.split('-')[0].toUpperCase()
      const tokenLBalance = {...window.CONFIG.getTokenBySymbol(tokenL), ...assets.getTokenBySymbol(tokenL)}
      this.setState({availableAmount: tokenLBalance.balance})
    }
  }

  render() {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const {form, dispatch, side = 'sell', pair = 'LRC-WETH',assets,prices,tickersByLoopring,tickersByPair,account} = this.props
    const tokenL = pair.split('-')[0].toUpperCase()
    const tokenR = pair.split('-')[1].toUpperCase()
    const tokenLBalance = {...config.getTokenBySymbol(tokenL), ...assets.getTokenBySymbol(tokenL)}
    const balanceL = fm.toBig(tokenLBalance.balance).div("1e"+tokenLBalance.digits).toNumber()
    tokenLBalance.balance = balanceL
    const tokenRBalance = {...config.getTokenBySymbol(tokenR), ...assets.getTokenBySymbol(tokenR)}
    const balanceR = fm.toBig(tokenRBalance.balance).div("1e"+tokenRBalance.digits).toNumber()
    tokenRBalance.balance = balanceR
    const marketConfig = window.CONFIG.getMarketBySymbol(tokenL, tokenR)
    const tokenRPrice = prices.getTokenBySymbol(tokenR)
    const integerReg = new RegExp("^[0-9]*$")
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

    const showModal = (payload)=>{
      dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        }
      })
    }

    const gotoError = (errors, e) => {
      if(e) e.stopPropagation()
      showModal({
        id: 'trade/place-order-error',
        errors,
      })
    }

    const showTradeModal = (tradeInfo) => {
      dispatch({
        type: 'modals/modalChange',
        payload: {
          id: 'trade/confirm',
          visible: true,
          side,
          pair,
          ...tradeInfo
        }
      })
    }

    function handleSubmit() {
      if(!window.WALLET_UNLOCK_TYPE) {
        return
      }
      form.validateFields((err, values) => {
        if (!err) {
          const tradeInfo = {}
          tradeInfo.amount = Number(values.amount)
          tradeInfo.price = Number(values.price)
          tradeInfo.total = tradeInfo.amount * tradeInfo.price
          if(this.state.timeToLivePopularSetting && values.timeToLivePopularSetting) {
            let timeToLive = 0
            switch(values.timeToLivePopularSetting){
              case '1hour': timeToLive = 3600; break;
              case '1day': timeToLive = 24 * 86400; break;
              case '1week': timeToLive = 7 * 24 * 86400; break;
              case '1month': timeToLive = 30 * 24 * 86400; break;
              default :
                console.error("invalid timeToLivePopularSetting:", values.timeToLivePopularSetting)
                return
            }
            tradeInfo.timeToLive = timeToLive
          } else if (values.timeToLiveUnit && values.timeToLive) {
            let timeToLive = Number(values.timeToLive)
            switch(values.timeToLiveUnit) {
              case 'second': break;
              case 'minute': timeToLive = timeToLive * 60; break;
              case 'hour': timeToLive = timeToLive * 3600; break;
              case 'day': timeToLive = timeToLive * 86400; break;
              default :
                console.error("invalid timeToLiveUnit:", values.timeToLiveUnit)
                return
            }
            tradeInfo.timeToLive = timeToLive
          }
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          const totalWorth = calculateWorthInLegalCurrency(tokenR, tradeInfo.total)
          if(totalWorth <= 0) {
            Modal.error({
              title: 'Error',
              content: "Failed fetch data from server",
            });
            return
          }
          let milliLrcFee = 0
          if (values.lrcFee) {
            milliLrcFee = Number(values.lrcFee)
            tradeInfo.milliLrcFee = milliLrcFee
          } else {
            milliLrcFee = Number(configs.defaultLrcFeePermillage)
          }
          let userSetLrcFeeInEth = calculateLrcFeeInEth(totalWorth, milliLrcFee)
          const minimumLrcfeeInEth = configs.minimumLrcfeeInEth
          if(userSetLrcFeeInEth >= minimumLrcfeeInEth){
            tradeInfo.lrcFee = calculateLrcFeeInLrc(totalWorth)
            showTradeModal(tradeInfo)
          } else {
            tradeInfo.lrcFee = calculateLrcFeeByEth(minimumLrcfeeInEth)
            const content = 'According to your setting, lrcFee is '+calculateLrcFeeByEth(userSetLrcFeeInEth)+'LRC, we increase it to a minimum value:'+tradeInfo.lrcFee+"LRC, will you continue place order?"
            showConfirm(content, tradeInfo)
          }
        }
      });
    }

    function showConfirm(content, tradeInfo) {
      Modal.confirm({
        title: 'Warning',
        content: content,
        onOk: toConfirm.bind(this, tradeInfo),
        onCancel() {},
      });
    }

    function toConfirm(tradeInfo) {
      const userOwnedLrc = assets.getTokenBySymbol("LRC").balance
      if(userOwnedLrc < tradeInfo.lrcFee){
        const errors = new Array()
        errors.push({
          type:"BalanceNotEnough",
          value:{
            symbol:'lrc',
            balance:userOwnedLrc,
            required:accSub(tradeInfo.lrcFee, userOwnedLrc),
          }})
        gotoError(errors)
      } else {
        showTradeModal(tradeInfo)
      }
    }

    function calculateWorthInLegalCurrency(symbol, amount) {
      const price = prices.getTokenBySymbol(symbol).price
      return amount * price
    }

    function calculateLrcFeeInEth(totalWorth, milliLrcFee) {
      const price = prices.getTokenBySymbol("eth").price
      return accDiv(accDiv(accMul(totalWorth, milliLrcFee), 1000), price)
    }

    function calculateLrcFeeInLrc(totalWorth) {
      const price = prices.getTokenBySymbol("lrc").price
      return accDiv(Math.floor(accMul(accDiv(totalWorth, price), 100)), 100)
    }

    function calculateLrcFeeByEth(ethAmount) {
      const ethPrice = prices.getTokenBySymbol("eth").price
      const lrcPrice = prices.getTokenBySymbol("lrc").price
      const price = accDiv(lrcPrice, ethPrice)
      return accDiv(Math.floor(accMul(accDiv(ethAmount, price), 100)), 100)
    }

    function handleCancle() {
    }

    function handleReset() {
      form.resetFields()
    }

    function validateAmount(value) {
      // const amount = Number(value)
      // const price = Number(form.getFieldValue("price"))
      // if (amount <= 0) return false
      // if (side === 'sell') {
      //   return amount <= tokenLBalance.balance
      // } else {
      //   if (price > 0) {
      //     return accMul(price, amount) <= tokenRBalance.balance
      //   } else {
      //     return true
      //   }
      // }
      return value > 0
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    function validateLrcFee(value) {
      if (value) {
        const v = Number(value)
        return v > 0 && v <= 50
      } else {
        return true
      }
    }

    function validateMarginSplit(value) {
      if (value) {
        const v = Number(value)
        return v >= 0 && v <= 100
      } else {
        return true
      }
    }

    function validateOptionInteger(value) {
      if (value) {
        return integerReg.test(value)
      } else {
        return true
      }
    }

    function inputChange(type, e) {
      let price = 0, amount = 0
      if (type === 'price') {
        price = e.target.value.toString()
        if (!amountReg.test(price)) return false
        const priceArr = price.split(".")
        if (priceArr[1] && priceArr[1].length > marketConfig.pricePrecision) {
          try {
            price = Number(priceArr[0] + "." + priceArr[1].substring(0, marketConfig.pricePrecision))
          } catch (e) {
            console.error(e)
            price = 0
          }
          e.target.value = price
        }
        this.setState({estimatePriceWorth: accMul(price, tokenRPrice.price).toFixed(2)})
        amount = Number(form.getFieldValue("amount"))
        if(side === 'buy'){
          const precision = Math.max(0,tokenRBalance.precision - marketConfig.pricePrecision)
          const availableAmount = Math.floor(tokenRBalance.balance / Number(price) * ("1e"+precision)) / ("1e"+precision)
          this.setState({availableAmount: availableAmount})
          form.setFieldsValue({"amountSlider":0})
        } else {
          const availableAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
          this.setState({availableAmount: availableAmount})
        }
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if (!amountReg.test(amount)) return false
        const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
        if (amountPrecision > 0) {
          const amountArr = amount.split(".")
          if (amountArr[1] && amountArr[1].length > amountPrecision) {
            try {
              amount = Number(amountArr[0] + "." + amountArr[1].substring(0, amountPrecision))
            } catch (e) {
              console.error(e)
              amount = 0
            }
          }
        } else {
          amount = Math.floor(amount)
        }
        e.target.value = amount
        price = Number(form.getFieldValue("price"))
      }
      const total = accMul(price, amount)
      form.setFieldsValue({"total": total})
    }

    function timeToLiveChange(e) {
      e.preventDefault();
      this.setState({timeToLivePopularSetting: !this.state.timeToLivePopularSetting})
    }

    function amountSliderChange(e) {
      if(this.state.availableAmount > 0) {
        const amount = this.state.availableAmount * Number(e) / 100
        form.setFieldsValue({"amount": amount})
        const price = Number(form.getFieldValue("price"))
        const total = accMul(price, amount)
        form.setFieldsValue({"total": total})
      }
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };
    const Option = Select.Option;
    const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
      initialValue: "second",
      rules: []
    })(
      <Select style={{width: 90}}>
        <Option value="second">Second</Option>
        <Option value="minute">Minute</Option>
        <Option value="hour">Hour</Option>
        <Option value="day">Day</Option>
      </Select>
    )

    const marks = {
      0: '0',
      25: '25％',
      50: '50％',
      75: '75％',
      100: '100％'
    };

    const amountSlider = form.getFieldDecorator('amountSlider', {
        initialValue: 0,
        rules: []
      })(
        <Slider min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)} disabled={this.state.availableAmount <= 0}/>
      )

    return (
      <div>
        <Form layout="horizontal">
          <Form.Item>
            <div className="row">
              <div className="col fs18 color-grey-900 text-capitalize">{side} {tokenL}</div>
              <div className="col-auto">
                {
                  side === 'buy' ? `${tokenR} Balance: ${tokenRBalance.balance}` : `${tokenL} Balance: ${tokenLBalance.balance}`
                }
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Price" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col fs10">{`≈USD ${this.state.estimatePriceWorth}`}</div>
            </div>
          }>
            {form.getFieldDecorator('price', {
              initialValue: 0,
              rules: [{
                message: 'Please input valid price',
                validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={tokenR}
                     onChange={inputChange.bind(this, 'price')}
                     onFocus={() => {
                       const amount = form.getFieldValue("price")
                       if (amount === 0) {
                         form.setFieldsValue({"price": ''})
                       }
                     }}
                     onBlur={() => {
                       const amount = form.getFieldValue("price")
                       if (amount === '') {
                         form.setFieldsValue({"price": 0})
                       }
                     }}/>
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false} extra={
            <div>
              <div className="fs10">{`Available Amount ${this.state.availableAmount}`}</div>
              <div className="fs10">{amountSlider}</div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [{
                message: 'Please input valid amount',
                validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
              }]
            })(
              <Input placeholder="" size="large" suffix={tokenL} onChange={inputChange.bind(this, 'amount')}
                     onFocus={() => {
                       const amount = Number(form.getFieldValue("amount"))
                       if (amount === 0) {
                         form.setFieldsValue({"amount": ''})
                       }
                     }}
                     onBlur={() => {
                       const amount = form.getFieldValue("amount")
                       if (amount === '') {
                         form.setFieldsValue({"amount": 0})
                       }
                     }}/>
            )}
          </Form.Item>
          <Form.Item className="mb5" label="Total" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('total', {
              initialValue: 0,
              rules: []
            })(
              <Input disabled className="d-block w-100" placeholder="" size="large" suffix={tokenR}/>
            )}
          </Form.Item>
          <Collapse bordered={false} defaultActiveKey={[]}>
            <Collapse.Panel className="" style={{border: 'none', margin: '0px -15px', padding: '0px -15px'}}
                            header={<div style={{}}>Advanced</div>} key="1">
              <div className="row">
                <div className="col-12">
                  {this.state.timeToLivePopularSetting &&
                  <Form.Item className="ttl" colon={false} label={
                    <div className="row">
                      <div className="col-auto">Time to live</div>
                      <div className="col"></div>
                      <div className="col-auto"><a href="" onClick={timeToLiveChange.bind(this)}>{this.state.timeToLivePopularSetting ? "More" : "Popular option" }</a></div>
                    </div>
                  }>
                    {form.getFieldDecorator('timeToLivePopularSetting')(
                      <RadioGroup>
                        <RadioButton value="1hour">1 Hour</RadioButton>
                        <RadioButton value="1day">1 Day</RadioButton>
                        <RadioButton value="1week">1 Week</RadioButton>
                        <RadioButton value="1month">1 Month</RadioButton>
                      </RadioGroup>
                    )}
                  </Form.Item>}
                  {!this.state.timeToLivePopularSetting &&
                  <Form.Item className="mb5 ttl" colon={false} label={
                    <div className="row">
                      <div className="col-auto">Time to live</div>
                      <div className="col"></div>
                      <div className="col-auto"><a href="" onClick={timeToLiveChange.bind(this)}>{this.state.timeToLivePopularSetting ? "More" : "Popular option"}</a></div>
                    </div>
                  }>
                    {form.getFieldDecorator('timeToLive', {
                      rules: [{
                        message: "Please input integer value",
                        validator: (rule, value, cb) => validateOptionInteger(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" addonAfter={timeToLiveSelectAfter}/>
                    )}
                  </Form.Item>}
                </div>
                <div className="col">
                  <Form.Item className="mb5" colon={false} label="Lrc Fee">
                    {form.getFieldDecorator('lrcFee', {
                      rules: [{
                        message: "Please input valid integer value(1~50)",
                        validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" suffix='‰'/>
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item className="mb5" colon={false} label="MarginSplit">
                    {form.getFieldDecorator('marginSplit', {
                      rules: [{
                        message: "Please input valid integer value(0~100)",
                        validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" suffix='％'/>
                    )}
                  </Form.Item>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
          {account && account.address &&
            <Form.Item>
              {
                side == 'buy' &&
                <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-green-500 border-none color-white"
                        size="large">
                  Place Order
                </Button>
              }
              {
                side == 'sell' &&
                <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-red-500 border-none color-white"
                        size="large">
                  Place Order
                </Button>
              }
            </Form.Item>
          }
          {(!account || !account.address) &&
            <div className="row justify-content-center bg-blue-grey-50">
              <div className="col-auto"><a onClick={showModal.bind(this,'wallet/unlock')}>Unlock</a> to trade</div>
            </div>
          }
        </Form>
      </div>
    );
  };
}

export default Form.create()(connect()(TradeForm));
