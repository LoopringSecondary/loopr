import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import ethLogo from '../../../assets/images/eth.png';
import wethLogo from '../../../assets/images/weth.png';
import wrapArrow from '../../../assets/images/wrap-arrow.png';
import WETH from '../../../common/Loopring/ethereum/weth'
import {configs} from '../../../common/config/data'
import {getTransactionCount} from '../../../common/Loopring/ethereum/utils'
import {BigNumber} from 'bignumber.js'

class Convert extends React.Component {
  state = {
    address: "0x4919776519F2B290E0E98AA8d9f5751b5321876C",
    privateKey:"93d2d40c13f4d4ca422c154dac7db78f8b0964ad8aa9047c9eb5dfa750357c4e",
    fromToken: 'ETH',
    amount: 0,
    selectedGasPrice: 30,
    selectedGasLimit: 21000,
    selectedGas: 0,
    exchangeRate : 6.3,
    selectMaxWarn: false,
    inputMaxWarn: false,
    estimateWorth: 0
  }
  render() {
    const {form, modal} = this.props
    let selectedToken = modal.item || {}
    //TODO mock data
    selectedToken = {...selectedToken, balance: 1.2, allowance: 0}
    function handleSubmit() {
      form.validateFields(async (err, values) => {
        console.log('values', values);
        if (!err) {
          const amount = '0x' + (new BigNumber(values.amount.toString()).times(1e18)).toString(16)
          const token = new WETH({address:this.state.address}) //todo
          const gasPrice = '0x' + (Number(this.state.selectedGasPrice) * 1e9).toString(16)
          const gasLimit = '0x' + Number(this.state.selectedGasLimit).toString(16);
          const chainId = configs.chainId | 1
          getTransactionCount(this.state.address).then((nonce)=>{
            console.log(nonce)
            return token.deposit(amount, this.state.privateKey, gasPrice, gasLimit, nonce, chainId)
          }).then(res=>{
             // TODO
            console.log(res)
          }).catch(error=>{
            return error
          })
        }
      });
    }

    function selectMax(e) {
      e.preventDefault();
      let wrapAmount = Number(selectedToken.balance)
      let selectMaxWarn = false
      if(this.state.fromToken === "ETH") {
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
        const v = Number(e.target.value)
        let inputMaxWarn = false;
        if(this.state.fromToken === "ETH" && v >= selectedToken.balance) {
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
            <img className="rounded-circle" src={ethLogo} style={{height: '60px'}}/>
          </div>
          <div className="col-auto">
            <img src={wrapArrow} alt="" style={{height: '14px'}}/>
          </div>
          <div className="col text-center">
            <img className="rounded-circle" src={wethLogo} style={{height: '60px'}}/>
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
                {required: true, message: 'Please input valid amount', transform:(value)=>Number(value),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large" addonAfter={this.state.fromToken} onChange={amountChange.bind(this)}/>
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
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Yes,Wrap Now!</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
};

export default Form.create()(Convert);


