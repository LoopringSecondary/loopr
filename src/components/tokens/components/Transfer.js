import React from 'react';
import { Col,Form,InputNumber,Button,Icon,Modal,Input,Radio,Switch,Select,Checkbox,Slider,Collapse,Card} from 'antd';
import validator from '../../../common/Loopring/common/validator'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi';
import {configs} from '../../../common/config/data'
import * as fm from '../../../common/Loopring/common/formatter'

class Transfer extends React.Component {
  state = {
    address: "0x4919776519F2B290E0E98AA8d9f5751b5321876C",
    estimateGasPrice: 30,
    selectedGasPrice: fm.toNumber(configs.defaultGasPrice),
    selectedGasLimit: 21000,
    selectedGas: 0,
    gasValueInSlider:0,
    advanced: false,
    value: 0,
    estimateWorth: 0,
    exchangeRate : 6.3
  }

  componentDidMount() {
    //TODO modify 21000
    const gas = fm.toBig(this.state.estimateGasPrice).times(21000).div(1e9)
    this.setState({selectedGas: fm.toNumber(gas.toFixed(8)), gasValueInSlider:fm.toNumber(gas.toFixed(8)) * 1e9})
  }

  render() {
    const {form, modal} = this.props
    let selectedToken = modal.item || {}
    //TODO mock data
    selectedToken = {...selectedToken, balance: 100.00, allowance: 0}
    function handleSubmit() {
      form.validateFields((err, values) => {
        if (!err) {
          const rawTx = {};
          if(this.state.advanced) {
            rawTx.gasPrice = fm.toHex(fm.toBig(this.state.selectedGasPrice).times(1e9))
            rawTx.gasLimit = fm.toHex(this.state.selectedGasLimit)
          } else {
            //TODO modify 21000
            const gasPrice = fm.toBig(this.state.selectedGas).div(21000).times(1e9).toFixed(2)
            rawTx.gasPrice = fm.toHex(fm.toBig(gasPrice).times(1e9))
            rawTx.gasLimit = fm.toHex(fm.toNumber(21000))
          }
          if(selectedToken.symbol === "ETH") {
            rawTx.to = values.to;
            rawTx.value = fm.toHex(fm.toBig(values.amount).times(1e18))
            rawTx.data = values.data || '0x'
          } else {
            const tokenConfig = window.CONFIG.getTokenBySymbol(selectedToken.symbol)
            rawTx.to = tokenConfig.address;
            rawTx.value = "0x0";
            let amount = fm.toHex(fm.toBig(values.amount).times("1e"+tokenConfig.digits))
            rawTx.data = generateAbiData({method: "transfer", address:values.to, amount});
          }
          rawTx.chainId = configs.chainId | 1
          const worth = (fm.toNumber(this.state.exchangeRate) * values.amount).toFixed(4)
          const extraData = {from:this.state.address, tokenSymbol:selectedToken.symbol, amount:values.amount, worth:worth}
          modal.hideModal({id: 'token/transfer'})
          modal.showModal({id: 'token/transfer/preview', rawTx, extraData})
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
      this.setState({value: selectedToken.balance, estimateWorth: selectedToken.balance * this.state.exchangeRate})
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
      return value && value <= selectedToken.balance
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
        const worth = (fm.toNumber(this.state.exchangeRate) * v).toFixed(4)
        this.setState({value: v, estimateWorth: worth})
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
    return (
      <Card title={"Send "+selectedToken.symbol}>
        <Form layout="horizontal">
          <Form.Item label="Recipient" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('to', {
              initialValue: '',
              rules: [
                {required: true, message: 'Invalid Ethereum address',
                  validator: (rule, value, cb) => validateEthAddress(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large"/>
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col-auto">{"≈USD "+this.state.estimateWorth}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>Send Max</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [
                {required: true, message: 'Please input valid amount', transform:(value)=>fm.toNumber(value),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={selectedToken.symbol}
                           onChange={amountChange.bind(this)} onFocus={() => {
                const amount = form.getFieldValue("amount")
                if(amount === 0) {
                  form.setFieldsValue({"amount": ''})
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
                    required: true, type : 'integer', message:"Please input integer value",
                    transform:(value)=>fm.toNumber(value)
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


