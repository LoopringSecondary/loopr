import React from 'react';
import { Col,Form,InputNumber,Button,Icon,Modal,Input,Radio,Switch,Select,Checkbox,Slider,Collapse,Card} from 'antd';
import validator from '../../../common/Loopring/common/validator'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi';
import {configs} from '../../../common/config/data'
import * as fm from '../../../common/Loopring/common/formatter'
import config from '../../../common/config'
import {accDiv, accMul} from '../../../common/Loopring/common/math'
import Currency from '../../../modules/settings/CurrencyContainer'

class Transfer extends React.Component {
  state = {
    selectedGasPrice: this.props.settings.trading.gasPrice,
    selectedGasLimit: '',
    selectedGas: 0,
    gasValueInSlider:0,
    advanced: false,
    value: 0
  }

  componentDidMount() {
    const {settings} = this.props
    const defaultGasLimit = config.getGasLimitByType('eth_transfer').gasLimit
    const gas = fm.toBig(this.state.selectedGasPrice).times(fm.toNumber(defaultGasLimit)).div(1e9)
    this.setState({selectedGas: fm.toNumber(gas.toFixed(8)), gasValueInSlider:fm.toNumber(gas.toFixed(8)) * 1e9})
  }

  render() {
    const {form, modal, account, settings, assets, prices} = this.props
    let selectedToken = modal.item || {}
    selectedToken = {...config.getTokenBySymbol(selectedToken.symbol), ...assets.getTokenBySymbol(selectedToken.symbol)}
    const balance = fm.toBig(selectedToken.balance).div("1e"+selectedToken.digits).toNumber()
    selectedToken.balance = balance
    const defaultGasLimit = config.getGasLimitByType('eth_transfer').gasLimit
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

    function handleSubmit() {
      form.validateFields((err, values) => {
        if (!err) {
          const tx = {};
          if(this.state.advanced) {
            tx.gasPrice = fm.toHex(fm.toBig(this.state.selectedGasPrice).times(1e9))
            tx.gasLimit = fm.toHex(this.state.selectedGasLimit)
          } else {
            const gasPrice = fm.toBig(this.state.selectedGas).div(fm.toNumber(defaultGasLimit)).times(1e9).toFixed(2)
            tx.gasPrice = fm.toHex(fm.toBig(gasPrice).times(1e9))
            tx.gasLimit = config.getGasLimitByType('eth_transfer').gasLimit
          }
          if(selectedToken.symbol === "ETH") {
            tx.to = values.to;
            tx.value = fm.toHex(fm.toBig(values.amount).times(1e18))
            tx.data = values.data || '0x'
          } else {
            const tokenConfig = window.CONFIG.getTokenBySymbol(selectedToken.symbol)
            tx.to = tokenConfig.address;
            tx.value = "0x0";
            let amount = fm.toHex(fm.toBig(values.amount).times("1e"+tokenConfig.digits))
            tx.data = generateAbiData({method: "transfer", address:values.to, amount});
          }
          const extraData = {from:account.address, tokenSymbol:selectedToken.symbol, amount:values.amount, price:prices.getTokenBySymbol(selectedToken.symbol).price}
          modal.hideModal({id: 'token/transfer'})
          modal.showModal({id: 'token/transfer/preview', tx, extraData})
        }
      });
    }

    function handleCancle() {
      modal.hideModal({id: 'transfer'})
    }

    function handleReset() {
      form.resetFields()
    }

    function resetForm() {
      // if(modal.state && modal['transfer']){
      //   const values = form.getFieldsValue()
      //   const transfer = modal.state['transfer'].data
      //   if(transfer.token && values['token'] != transfer['token'] ){
      //     form.resetFields()
      //   }
      // }
    }

    function isInteger(v){
      const value = v.toString()
      if(value) {
        var result = value.match(/^(-|\+)?\d+$/);
        if(result === null) return false;
        return true;
      }
    }

    function isNumber(v) {
      const value = v.toString()
      if(value) {
        var result = value.toString().match(amountReg)
        if(result === null) return false;
        return true;
      }
    }

    function setAdvance(v) {
      setTimeout(()=>{
        this.setState({advanced:v})
      },0)
    }

    function setGas(v) {
      setTimeout(()=>{
        const gas = fm.toBig(v).div(1e9)
        this.setState({gasValueInSlider:v, selectedGas:gas.toString(10)})
      },0)
    }

    function selectMax(e) {
      e.preventDefault();
      this.setState({value: selectedToken.balance})
      form.setFieldsValue({"amount": selectedToken.balance})
    }

    function validateEthAddress(value) {
      try {
        validator.validate({value: value, type: 'ADDRESS'})
        return true;
      } catch (e) {
        return false;
      }
    }

    function validateAmount(value) {
      if(isNumber(value)) {
        return value && value <= selectedToken.balance
      } else {
        return false
      }
    }

    function amountFocus() {
      const amount = form.getFieldValue("amount")
      if(amount === 0 || amount === '0') {
        form.setFieldsValue({"amount": ''})
      }
    }

    function amountChange(e) {
      if(e.target.value) {
        const v = fm.toNumber(e.target.value)
        this.setState({value: v})
      }
    }

    function gasLimitChange(e) {
      if(e.target.value){
        const gasLimit = fm.toNumber(e.target.value)
        this.setState({selectedGasLimit: gasLimit})
      }
    }

    function gasPriceChange(e) {
      const gasPrice = fm.toNumber(e)
      this.setState({selectedGasPrice: gasPrice})
    }

    resetForm()
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    }
    const formatGas = (value) => {
      return (value / 1e9) + " ether";
    }
    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {accMul(this.state.value, prices.getTokenBySymbol(selectedToken.symbol).price).toFixed(2)}
      </span>
    )
    return (
      <Card title={"Send "+selectedToken.symbol}>
        <Form layout="horizontal">
          <Form.Item label="Recipient" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('to', {
              initialValue: '',
              rules: [
                {message: 'Invalid Ethereum address',
                  validator: (rule, value, cb) => validateEthAddress(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large"/>
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col-auto">{priceValue}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>Send Max</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [
                {
                  message: 'Please input valid amount',
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={selectedToken.symbol}
                     onChange={amountChange.bind(this)} onFocus={() => {
                const amount = form.getFieldValue("amount")
                if (amount === 0) {
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

          {!this.state.advanced &&
            <div>
              <div style={{height:"253px"}}>
                <Form.Item className="mb0" label={"Transaction Fee: "+formatGas(this.state.gasValueInSlider)} colon={false}>
                  {form.getFieldDecorator('transactionFee', {
                    initialValue: this.state.gasValueInSlider,
                    rules: []
                  })(
                    <Slider min={200000} max={3000000} step={10}
                            marks={{
                              200000: 'slow',
                              3000000: 'fast'
                            }}
                            tipFormatter={formatGas}
                            onChange={setGas.bind(this)}
                    />
                  )}
                </Form.Item>
              </div>
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label="Advance" colon={false}>
                    <Switch onChange={setAdvance.bind(this)}/>
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          {this.state.advanced &&
            <div>
              <Form.Item label="Data" {...formItemLayout} colon={false}>
                {form.getFieldDecorator('data', {
                  initialValue: '',
                  rules: []
                })(
                  <Input className="d-block w-100" placeholder="" size="large"/>
                )}
              </Form.Item>
              <Form.Item label="Gas Limit" {...formItemLayout} colon={false}>
                {form.getFieldDecorator('gasLimit', {
                  initialValue: this.state.selectedGasLimit,
                  rules: [{
                    message:"Please input integer value",
                    validator: (rule, value, cb) => isInteger(value) ? cb() : cb(true)
                  }],
                })(
                  <Input className="d-block w-100" placeholder="" size="large" onChange={gasLimitChange.bind(this)}/>
                )}
              </Form.Item>
              <Form.Item label="GasPrice" colon={false}>
                {form.getFieldDecorator('gasPrice', {
                  initialValue: fm.toNumber(configs.defaultGasPrice),
                  rules: []
                })(
                  <Slider min={1} max={99} step={1}
                          marks={{
                            1: 'slow',
                            99: 'fast'
                          }}
                          onChange={gasPriceChange.bind(this)}
                  />
                )}
              </Form.Item>
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label="Advance" colon={false}>
                    <Switch defaultChecked onChange={setAdvance.bind(this)}/>
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          <Form.Item>
            <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
};


export default Form.create()(Transfer);


