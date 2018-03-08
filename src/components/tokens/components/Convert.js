import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import ethLogo from '../../../assets/images/eth.png';
import wethLogo from '../../../assets/images/weth.png';
import wrapArrow from '../../../assets/images/wrap-arrow.png';
import WETH from '../../../common/Loopring/ethereum/weth'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi'
import {configs} from '../../../common/config/data'
import Transaction from "../../../common/Loopring/ethereum/transaction";
import * as fm from '../../../common/Loopring/common/formatter'

class Convert extends React.Component {
  state = {
    amount: 0,
    exchangeRate : 6.3,
    selectMaxWarn: false,
    inputMaxWarn: false,
    estimateWorth: 0,
    errorMsg: ''
  }

  render() {
    const {form, modal, account, settings} = this.props
    let selectedToken = modal.item || {}
    //TODO mock data
    selectedToken = {...selectedToken, balance: 1.2, allowance: 0}

    function handleSubmit() {
      const _this = this
      form.validateFields((err, values) => {
        if (!err) {
          window.STORAGE.wallet.getNonce(account.address).then(nonce => {
            if(selectedToken.symbol === "ETH") {
              return deposit(values.amount, nonce)
            } else {
              return withdraw(values.amount, nonce)
            }
          }).then(res=>{
            console.log(res)
            if (res.error) {
              _this.setState({errorMsg: res.error.message})
            } else {
              window.STORAGE.transactions.addTx({hash: res.result, owner: account.address})
              modal.hideModal({id:'token/convert'})
              const result = {extraData:{txHash:res.result}}
              modal.showModal({id:'token/transfer/result', result})
            }
          }).catch(error=>{
            console.error(error)
            _this.setState({errorMsg: error.message})
          })
        }
      });
    }

    function deposit(amount, nonce) {
      const wethConfig = window.CONFIG.getTokenBySymbol('WETH')
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = fm.toHex(fm.toBig(amount).times(1e18));
      tx.data = generateAbiData({method: "deposit"});
      tx.gasPrice = fm.toHex(fm.toNumber(settings.trading.gasPrice) * 1e9)
      tx.nonce = fm.toHex(nonce)
      let newTx = new Transaction(tx)
      newTx.complete(account.address)
      return window.WALLET.sendTransaction(newTx.raw)
    }

    function withdraw(amount, nonce) {
      const wethConfig = window.CONFIG.getTokenBySymbol('WETH')
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = fm.toHex(fm.toBig(amount).times(1e18));
      tx.data = generateAbiData({method: "withdraw", amount:tx.value});
      tx.gasPrice = fm.toHex(fm.toNumber(settings.trading.gasPrice) * 1e9)
      tx.nonce = fm.toHex(nonce)
      let newTx = new Transaction(tx)
      newTx.complete(account.address)
      return window.WALLET.sendTransaction(newTx.raw)
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


