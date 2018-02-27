import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import ethLogo from '../../../assets/images/eth.png';
import wethLogo from '../../../assets/images/weth.png';
import wrapArrow from '../../../assets/images/wrap-arrow.png';
import WETH from '../../../common/Loopring/ethereum/weth'
import {configs} from '../../../common/config/data'
import {getTransactionCount} from '../../../common/Loopring/ethereum/utils'
import * as fm from '../../../common/Loopring/common/formatter'

class Convert extends React.Component {
  state = {
    address: "0x4919776519F2B290E0E98AA8d9f5751b5321876C",
    privateKey:"93d2d40c13f4d4ca422c154dac7db78f8b0964ad8aa9047c9eb5dfa750357c4e",
    amount: 0,
    selectedGasPrice: 30,
    selectedGasLimit: 21000,
    exchangeRate : 6.3,
    selectMaxWarn: false,
    inputMaxWarn: false,
    estimateWorth: 0,
    errorMsg: ''
  }

  render() {
    const {form, modal} = this.props
    let selectedToken = modal.item || {}
    //TODO mock data
    selectedToken = {...selectedToken, balance: 1.2, allowance: 0}

    function handleSubmit() {
      const _this = this
      form.validateFields((err, values) => {
        if (!err) {
          const wethConfig = window.CONFIG.getTokenBySymbol('WETH')
          const formatedAmount = fm.toHex(fm.toBig(values.amount).times(1e18))
          const api = new WETH({address:wethConfig.address})
          const gasPrice = fm.toHex(fm.toNumber(this.state.selectedGasPrice) * 1e9)
          const gasLimit = fm.toHex(fm.toNumber(this.state.selectedGasLimit))
          const chainId = configs.chainId || 1
          getTransactionCount(this.state.address).then((nonce)=>{
            if(nonce.result){
              if(selectedToken.symbol === "ETH") {
                return api.deposit({amount:formatedAmount, privateKey:this.state.privateKey, gasPrice, gasLimit, nonce:nonce.result, chainId})
              } else {
                return api.withDraw({amount:formatedAmount, privateKey:this.state.privateKey, gasPrice, gasLimit, nonce:nonce.result, chainId})
              }
            } else {
              throw new Error('Failed to call ethereum API, please try later')
            }
          }).then(deposit=>{
            // TODO
            console.log("deposit:"+deposit)
          }).catch(error=>{
            console.error(error)
            this.setState({errorMsg: error.message})
          })
        }
      });
    }

    function selectMax(e) {
      e.preventDefault();
      let wrapAmount = fm.toNumber(selectedToken.balance)
      let selectMaxWarn = false
      if(selectedToken.symbol === "ETH") {
        wrapAmount = Math.max(selectedToken.balance - 0.1, 0)
        selectMaxWarn = true
      }
      this.setState({amount: wrapAmount, estimateWorth: wrapAmount * this.state.exchangeRate, selectMaxWarn:selectMaxWarn, inputMaxWarn:false})
      form.setFieldsValue({"amount": wrapAmount})
    }

    function validateAmount(value) {
      return value && value <= selectedToken.balance
    }

    function amountChange(e) {
      if(e.target.value) {
        const v = fm.toNumber(e.target.value)
        let inputMaxWarn = false;
        if(selectedToken.symbol === "ETH" && v >= selectedToken.balance) {
          inputMaxWarn = true
        }
        this.setState({amount: v, estimateWorth: v * this.state.exchangeRate, selectMaxWarn: false, inputMaxWarn: inputMaxWarn})
      }
    }

    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    }
    return (
      <Card title="Convert">
        <div className="row justify-content-center align-items-center mb15">
          <div className="col text-center">
            <img className="rounded-circle" src={selectedToken.symbol === "ETH" ? ethLogo : wethLogo} style={{height: '60px'}}/>
          </div>
          <div className="col-auto">
            <img src={wrapArrow} alt="" style={{height: '14px'}}/>
          </div>
          <div className="col text-center">
            <img className="rounded-circle" src={selectedToken.symbol === "ETH" ? wethLogo : ethLogo} style={{height: '60px'}}/>
          </div>
        </div>
        <Form layout="horizontal">
          <Form.Item label="Amount" colon={false} {...formItemLayout} className="mb0" extra={
            <div className="row">
              <div className="col-auto">{"≈USD "+this.state.estimateWorth}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>Wrap Max</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: '',
              rules: [
                {message: 'Please input valid amount', transform:(value)=>fm.toNumber(value),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large" addonAfter={selectedToken.symbol} onChange={amountChange.bind(this)}/>
            )}
          </Form.Item>

          <Form.Item className="mb0 mt15">
            {this.state.selectMaxWarn &&
              <div className="fs12 color-grey-500 text-center mb5">
                0.1 ETH is reserved as gas so that you can send transactions.
              </div>
            }
            {this.state.inputMaxWarn &&
              <div className="fs12 color-grey-500 text-center mb5">
                You do not or will not have sufficient ETH as gas for sending transactions.
              </div>
            }
            <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large">Yes,Wrap Now!</Button>
            {this.state.errorMsg &&
              <div className="fs12 color-red-500 text-center mb5">
                {this.state.errorMsg}
              </div>
            }
          </Form.Item>
        </Form>
      </Card>
    );
  }
};

export default Form.create()(Convert);


