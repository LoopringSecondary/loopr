import React from 'react';
import { Col,Form,InputNumber,Button,Icon,Modal,Input,Radio,Switch,Select,Checkbox,Slider,Collapse,Card,Popover} from 'antd';
import validator from '../../../common/Loopring/common/validator'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi';
import {configs} from '../../../common/config/data'
import * as fm from '../../../common/Loopring/common/formatter'
import config from '../../../common/config'
import {accDiv, accMul} from '../../../common/Loopring/common/math'
import Currency from '../../../modules/settings/CurrencyContainer'
import {getGasPrice} from '../../../common/Loopring/relay/utils'
import intl from 'react-intl-universal';

class Transfer extends React.Component {
  state = {
    selectedGasPrice: 0,
    selectedGasLimit: '',
    selectedGas: 0,
    estimateGasPrice : 0,
    estimateGas:0,
    gasValueInSlider:0,
    advanced: false,
    value: 0,
    gasMark: {
      200000: intl.get('token.slow'),
      3000000: intl.get('token.fast')
    },
    tokenSymbol: '',
    showTokenSelector : false
  }

  componentDidMount() {
    const {settings, modal, assets, form} = this.props
    const defaultGasLimit = config.getGasLimitByType('eth_transfer').gasLimit
    const gas = fm.toBig(settings.trading.gasPrice).times(fm.toNumber(defaultGasLimit)).div(1e9)
    this.setState({selectedGas: fm.toNumber(gas.toFixed(8)), gasValueInSlider:fm.toNumber(gas.toFixed(8)) * 1e9})
    getGasPrice().then(res=>{
      const estimateGas = fm.toBig(fm.toBig(fm.toNumber(res.result) * defaultGasLimit).div(1e18).toFixed(8))
      const estimateGasShow = estimateGas.times(1e9)
      this.setState({
        gasMark: {
          200000: intl.get('token.slow'),
          [estimateGasShow]: '',
          3000000: intl.get('token.fast')
        },
        estimateGasPrice:estimateGasShow.toNumber(),
        estimateGas: estimateGas
      })
    })
    if(modal.item) {
      const currentToken = modal.item
      this.setState({tokenSymbol: currentToken.symbol})
    } else {
      this.setState({showTokenSelector: true})
    }
  }

  render() {
    function getToken(symbol) {
      let selectedToken = {...config.getTokenBySymbol(symbol), ...assets.getTokenBySymbol(symbol)}
      const balance = fm.toBig(selectedToken.balance).div("1e"+selectedToken.digits).toNumber()
      selectedToken.balance = balance
      return selectedToken
    }
    const _this = this
    const {form, modal, account, settings, assets, prices} = this.props
    const defaultGasLimit = config.getGasLimitByType('eth_transfer').gasLimit
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

    function handleSubmit() {
      form.validateFields((err, values) => {
        if (!err) {
          const tx = {};
          let tokenSymbol = _this.state.tokenSymbol
          if(_this.state.advanced) {
            tx.gasPrice = fm.toHex(fm.toBig(_this.state.selectedGasPrice).times(1e9))
            tx.gasLimit = fm.toHex(_this.state.selectedGasLimit)
          } else {
            const gasPrice = fm.toBig(_this.state.selectedGas).div(fm.toNumber(defaultGasLimit)).times(1e9).toFixed(2)
            tx.gasPrice = fm.toHex(fm.toBig(gasPrice).times(1e9))
            if(tokenSymbol === "ETH") {
              tx.gasLimit = config.getGasLimitByType('eth_transfer').gasLimit
            } else {
              tx.gasLimit = config.getGasLimitByType('token_transfer').gasLimit
            }
          }
          if(_this.state.showTokenSelector) {
            tokenSymbol = form.getFieldValue("token")
          }
          if(tokenSymbol === "ETH") {
            tx.to = values.to;
            tx.value = fm.toHex(fm.toBig(values.amount).times(1e18))
            tx.data = values.data || '0x';
          } else {
            const tokenConfig = window.CONFIG.getTokenBySymbol(tokenSymbol)
            tx.to = tokenConfig.address;
            tx.value = "0x0";
            let amount = fm.toHex(fm.toBig(values.amount).times("1e"+tokenConfig.digits))
            tx.data = generateAbiData({method: "transfer", address:values.to, amount});
          }
          const extraData = {from:account.address, to:values.to, tokenSymbol:tokenSymbol, amount:values.amount, price:prices.getTokenBySymbol(tokenSymbol).price}
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
      if(this.state.tokenSymbol) {
        const token = getToken(this.state.tokenSymbol)
        this.setState({value: token.balance})
        form.setFieldsValue({"amount": token.balance})
      }
    }

    function validateTokenSelect(value) {
      const result = form.validateFields(["amount"], {force:true})
      if(value) {
        return true
      } else {
        return false
      }
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
      let tokenSymbol = this.state.tokenSymbol
      if(this.state.showTokenSelector) {
        tokenSymbol = form.getFieldValue("token")
      }
      if(isNumber(value)) {
        const token = getToken(tokenSymbol)
        return value && value <= token.balance
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
        console.log('change:', e.target.value)
        this.setState({selectedGasLimit: gasLimit})
      }
    }

    function gasPriceChange(e) {
      const gasPrice = fm.toNumber(e)
      this.setState({selectedGasPrice: gasPrice})
    }

    resetForm()

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };

    const formatGas = (value) => {
      return (value / 1e9) + " ether";
    }

    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {accMul(this.state.value, prices.getTokenBySymbol(this.state.tokenSymbol).price).toFixed(2)}
      </span>
    )

    function toContinue(e) {
      if(e.keyCode === 13) {
        e.preventDefault();
        handleSubmit()
      }
    }

    function handleChange(v) {
      if(v) {
        this.setState({tokenSymbol : v})
      } else {
        this.setState({tokenSymbol : ''})
      }
    }
    const transactionFee = (
      <Popover overlayClassName="place-order-form-popover" title={<div className="pt5 pb5">{intl.get('token.custum_gas_title')}</div>} content={
        <div style={{maxWidth:'300px',padding:'5px'}}>
          <div className="pb10">{intl.get('token.custum_gas_content', {gas: this.state.estimateGas})}</div>
          {form.getFieldDecorator('transactionFee', {
            initialValue: this.state.gasValueInSlider,
            rules: []
          })(
            <Slider min={200000} max={3000000} step={10}
                    marks={this.state.gasMark}
                    tipFormatter={formatGas}
                    onChange={setGas.bind(this)}
            />
          )}
        </div>
      } trigger="click">
        <a className="fs12 pointer color-black-3 mr5"><Icon type="edit" /></a>
      </Popover>
    )
    return (
      <Card title={`${intl.get('token.send')} ${this.state.tokenSymbol}`}>
        <Form layout="horizontal">
          {this.state.showTokenSelector &&
          <Form.Item className="pt0 pb0" label={<div className="fs3 color-black-2">{intl.get('token.select_token')}</div>} {...formItemLayout} colon={false}>
            {form.getFieldDecorator('token', {
              initialValue: '',
              rules: [
                {message: intl.get("token.token_select_verification_message"),
                  validator: (rule, value, cb) => validateTokenSelect(value) ? cb() : cb(true)
                }
              ]
            })(
              <Select
                size="large"
                className="d-block w-100"
                showSeach={true}
                allowClear
                style={{ width: 300 }}
                placeholder="Select Token"
                optionFilterProp="children"
                onChange={handleChange.bind(this)}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {assets.items.map((token,index) => {
                  const asset = {...config.getTokenBySymbol(token.symbol), ...assets.getTokenBySymbol(token.symbol)}
                  return <Select.Option value={asset.symbol} key={index}>{asset.name}</Select.Option>}
                )}
              </Select>
            )}
          </Form.Item>
          }
          <Form.Item className="pt0 pb0" label={<div className="fs3 color-black-2">{intl.get('token.recipient')}</div>} {...formItemLayout} colon={false}>
            {form.getFieldDecorator('to', {
              initialValue: '',
              rules: [
                {message: intl.get("token.eth_address_verification_message"),
                  validator: (rule, value, cb) => validateEthAddress(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large" onKeyDown={toContinue.bind(this)}/>
            )}
          </Form.Item>
          <Form.Item className="pt0 pb0" label={<div className="fs3 color-black-2">{intl.get('token.amount')}</div>} {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col-auto">{priceValue}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>{intl.get("token.send_max")}</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [
                {
                  message: intl.get('token.amount_verification_message'),
                  validator: (rule, value, cb) => validateAmount.call(this, value) ? cb() : cb(true)
                }
              ]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={this.state.tokenSymbol}
                     onChange={amountChange.bind(this)} onKeyDown={toContinue.bind(this)}
                     onFocus={() => {
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
              <div style={{height:""}}>
                <Form.Item className="mb0 pb10" colon={false} label={null}>
                  <div className="row align-items-center">
                    <div className="col-auto fs3 color-black-2">
                      {intl.get('token.transaction_fee')}
                    </div>
                    <div className="col"></div>
                    <div className="col-auto pl0 pr5">{transactionFee}</div>
                    <div className="col-auto pl0 fs3 color-black-2">{formatGas(this.state.gasValueInSlider)}</div>
                  </div>
                </Form.Item>
              </div>
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label={intl.get('token.advanced')} colon={false}>
                    <Switch onChange={setAdvance.bind(this)}/>
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          {this.state.advanced &&
            <div>
              <Form.Item label={<div className="fs3 color-black-2">{intl.get('token.data')}</div>} {...formItemLayout} colon={false}>
                {form.getFieldDecorator('data', {
                  initialValue: '',
                  rules: []
                })(
                  <Input className="d-block w-100" placeholder="" size="large"/>
                )}
              </Form.Item>
              <Form.Item label={<div className="fs3 color-black-2">{intl.get('token.gas_limit')}</div>} {...formItemLayout} colon={false}>
                {form.getFieldDecorator('gasLimit', {
                  initialValue: this.state.selectedGasLimit,
                  rules: [{
                    message:intl.get('trade.integer_verification_message'),
                    validator: (rule, value, cb) => isInteger(value) ? cb() : cb(true)
                  }],
                })(
                  <Input className="d-block w-100" placeholder="" size="large" onChange={gasLimitChange.bind(this)}/>
                )}
              </Form.Item>
              <Form.Item label={<div className="fs3 color-black-2">{intl.get('token.gas_price')}</div>} colon={false}>
                {form.getFieldDecorator('gasPrice', {
                  initialValue: fm.toNumber(configs.defaultGasPrice),
                  rules: []
                })(
                  <Slider min={1} max={99} step={1}
                          marks={{
                            1: intl.get('token.slow'),
                            99: intl.get('token.fast')
                          }}
                          onChange={gasPriceChange.bind(this)}
                  />
                )}
              </Form.Item>
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label={intl.get('token.advanced')} colon={false}>
                    <Switch defaultChecked onChange={setAdvance.bind(this)}/>
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          <Form.Item>
            <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large">{intl.get('token.continue')}</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
};


export default Form.create()(Transfer);


