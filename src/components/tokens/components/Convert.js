import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import wrapArrow from '../../../assets/images/wrap-arrow.png';
import WETH from '../../../common/Loopring/ethereum/weth'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi'
import * as fm from '../../../common/Loopring/common/formatter'
import * as math from '../../../common/Loopring/common/math'
import config from '../../../common/config'
import Currency from '../../../modules/settings/CurrencyContainer'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import intl from 'react-intl-universal';
import CoinIcon from '../../common/CoinIcon';

class Convert extends React.Component {
  state = {
    amount: 0,
    selectMaxWarn: false,
    inputMaxWarn: false,
    errorMsg: ''
  }

  render() {
    const {form, modal, account, settings, assets, prices} = this.props
    let selectedToken = modal.item || {}
    selectedToken = {...config.getTokenBySymbol(selectedToken.symbol), ...assets.getTokenBySymbol(selectedToken.symbol)}
    const balance = fm.toBig(selectedToken.balance).div("1e"+selectedToken.digits).toNumber()
    selectedToken.balance = balance
    const price = prices.getTokenBySymbol(selectedToken.symbol)

    function handleSubmit() {
      const _this = this
      form.validateFields((err, values) => {
        if (!err) {
          let nonce = 0
          window.STORAGE.wallet.getNonce(account.address).then(result => {
            nonce = result
            if(selectedToken.symbol === "ETH") {
              return deposit(values.amount, nonce)
            } else {
              return withdraw(values.amount, nonce)
            }
          }).then(res=>{
            if (res.error) {
              _this.setState({errorMsg: res.error.message})
            } else {
              window.STORAGE.transactions.addTx({hash: res.result, owner: account.address})
              window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:nonce})
              notifyTransactionSubmitted(res.result);
              modal.hideModal({id:'token/convert'})
              const result = {extraData:{txHash:res.result, amount:values.amount, price:price.price, tokenSymbol:selectedToken.symbol, pageFrom:'Convert'}}
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
      const wethConfig = config.getTokenBySymbol('WETH')
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = fm.toHex(fm.toBig(amount).times(1e18));
      tx.data = generateAbiData({method: "deposit"});
      tx.gasPrice = fm.toHex(fm.toNumber(settings.trading.gasPrice) * 1e9)
      tx.nonce = fm.toHex(nonce)
      return window.WALLET.sendTransaction(tx)
    }

    function withdraw(amount, nonce) {
      const wethConfig = config.getTokenBySymbol('WETH')
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = '0x0';
      tx.data = generateAbiData({method: "withdraw", amount:fm.toHex(fm.toBig(amount).times(1e18))});
      tx.gasPrice = fm.toHex(fm.toNumber(settings.trading.gasPrice) * 1e9)
      tx.nonce = fm.toHex(nonce);
      return window.WALLET.sendTransaction(tx)
    }

    function selectMax(e) {
      e.preventDefault();
      let wrapAmount = fm.toNumber(selectedToken.balance)
      let selectMaxWarn = false
      if(selectedToken.symbol === "ETH") {
        wrapAmount = Math.max(math.accSub(selectedToken.balance, 0.1), 0)
        selectMaxWarn = true
      }
      this.setState({amount: wrapAmount, selectMaxWarn:selectMaxWarn, inputMaxWarn:false})
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
        this.setState({amount: v, inputMaxWarn: inputMaxWarn})
      }
    }

    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    }

    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {math.accMul(this.state.amount, prices.getTokenBySymbol(selectedToken.symbol).price).toFixed(2)}
      </span>
    )

    return (
      <Card title={intl.get('token.convert_title')}>
        <div className="row justify-content-center align-items-center mb15">
          <div className="col text-right">
            <span className="text-center">
               <CoinIcon size="60" symbol={selectedToken.symbol === "ETH" ? 'ETH' :'WETH' } />
                <br/>
                <span className="fs12 m5">{selectedToken.symbol === "ETH" ? 'ETH' :'WETH' }</span>
            </span>
          </div>
          <div className="col-auto">
            <img src={wrapArrow} alt="" style={{height: '14px'}}/>
          </div>
          <div className="col text-left">
            <span className="text-center">
              <CoinIcon size="60" symbol={selectedToken.symbol === "ETH" ? 'WETH' :'ETH' } />
              <br/>
              <span className="fs12 m5">{selectedToken.symbol === "ETH" ? 'ETH' :'WETH' }</span>
            </span>
          </div>
        </div>
        <Form layout="horizontal">
          <Form.Item colon={false} className="mb0" extra={
            <div className="row">
              <div className="col-auto">{priceValue}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>{intl.get('token.convert_max')}</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: '',
              rules: [
                {message: intl.get('token.amount_verification_message'), transform:(value)=>fm.toNumber(value),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder={intl.get('token.amount')} size="large" addonAfter={selectedToken.symbol} onChange={amountChange.bind(this)}/>
            )}
          </Form.Item>

          <Form.Item className="mb0 mt15">
            {this.state.selectMaxWarn &&
              <div className="fs12 color-grey-500 text-center mb5">
                {intl.get('token.min_gas_remain_warn')}
              </div>
            }
            {this.state.inputMaxWarn &&
              <div className="fs12 color-grey-500 text-center mb5">
                {intl.get('token.no_eth_balance_warn')}
              </div>
            }
            <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large">{intl.get('token.convert_confirm')}</Button>
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


