import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import WETH from '../../../common/Loopring/ethereum/weth'
import {generateAbiData} from '../../../common/Loopring/ethereum/abi'
import * as fm from '../../../common/Loopring/common/formatter'
import * as math from '../../../common/Loopring/common/math'
import config from '../../../common/config'
import Currency from '../../../modules/settings/CurrencyContainer'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import intl from 'react-intl-universal';
import CoinIcon from '../../common/CoinIcon';
import Notification from 'Loopr/Notification'
import {getEstimatedAllocatedAllowance} from '../../../common/Loopring/relay/utils'

class Convert extends React.Component {
  state = {
    amount: 0,
    frozenWethAmount: fm.toBig(0),
    selectMaxWarn: false,
    inputMaxWarn: false,
    errorMsg: '',
    loading:false
  }

  componentDidMount() {
    const {modal} = this.props;
    let selectedToken = modal.item || {}
    let showFrozenAmount = modal.showFrozenAmount
    if(selectedToken.symbol === 'ETH' && showFrozenAmount) {
      const wethConfig = config.getTokenBySymbol('WETH')
      getEstimatedAllocatedAllowance(window.WALLET.getAddress(), 'WETH').then(res=>{
        if (!res.error) {
          let frozenAmount = fm.toBig(res.result).div('1e'+wethConfig.digits);
          if(frozenAmount.gt(0)){
            this.setState({frozenWethAmount:frozenAmount})
          }
        }
      })
    }
  }

  render() {
    const {form, modal, account, settings, assets, prices} = this.props;
    let selectedToken = modal.item || {};
    selectedToken = {...config.getTokenBySymbol(selectedToken.symbol), ...assets.getTokenBySymbol(selectedToken.symbol)};
    selectedToken.balance = fm.toBig(selectedToken.balance).div("1e"+selectedToken.digits)
    const price = prices.getTokenBySymbol(selectedToken.symbol);
    const ethConfig = config.getTokenBySymbol('ETH');
    const ethBalance = assets.getTokenBySymbol('ETH');
    ethBalance.balance = fm.toBig(ethBalance.balance).div("1e"+ethConfig.digits);
    const wethConfig = config.getTokenBySymbol('WETH');
    const wethBalance = assets.getTokenBySymbol('WETH');
    wethBalance.balance = fm.toBig(wethBalance.balance).div("1e"+wethConfig.digits);
    let convertAmount = 0, adviceConvert = 0;
    if(selectedToken.symbol === 'ETH' && modal.showFrozenAmount && this.state.frozenWethAmount.gt(0)) {
      if(wethBalance.balance.lt(this.state.frozenWethAmount) ) {
        convertAmount = this.state.frozenWethAmount.minus(wethBalance.balance);
        if(convertAmount.gt(0)) {
          adviceConvert = Math.ceil(convertAmount)
        }
      }
    }
    const _this = this;
    const viewInEtherscan = (txHash) => {
      window.open(`https://etherscan.io/tx/${txHash}`,'_blank')
    };
    function handleSubmit() {
      form.validateFields((err, values) => {
        if (!err) {
          _this.setState({loading:true})
          let nonce = 0
          window.STORAGE.wallet.getNonce(account.address).then(result => {
            nonce = result
            if(selectedToken.symbol === "ETH") {
              return deposit(values.amount, nonce)
            } else {
              return withdraw(values.amount, nonce)
            }
          }).then(({response,rawTx})=>{
            if (response.error) {
              Notification.open({
                message:intl.get('token.convert_failed'),
                description:response.error.message,
                type:'error'
              })
              // _this.setState({errorMsg: res.error.message})
              _this.setState({loading:false})
            } else {
            //  window.STORAGE.transactions.addTx({hash: response.result, owner: account.address})
              window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:nonce})
              notifyTransactionSubmitted({txHash:response.result,rawTx,from:window.WALLET.getAddress()});
              modal.hideModal({id:'token/convert'});
              const result = {extraData:{txHash:response.result, amount:values.amount, price:price.price, tokenSymbol:selectedToken.symbol, pageFrom:'Convert'}}
              //modal.showModal({id:'token/transfer/result', result})
              const worth = `${fm.getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${math.accMul(result.extraData.amount, result.extraData.price).toFixed(2)}`
              Notification.open({
                message:intl.get('token.convert_succ_notification_title'),
                description:`${intl.get('token.result_convert_success', {amount:result.extraData.amount, token:result.extraData.tokenSymbol})}`,
                type:'success',
                actions:(
                  <div>
                    <Button className="alert-btn mr5" onClick={viewInEtherscan.bind(this, result.extraData.txHash)}>{intl.get('token.transfer_result_etherscan')}</Button>
                  </div>
                )
              })
              _this.setState({loading:false})
            }
          }).catch(error=>{
            Notification.open({
              message:intl.get('token.convert_failed'),
              description:error.message,
              type:'error'
            })
            // _this.setState({errorMsg: error.message})
            _this.setState({loading:false})
          })
        }
      });
    }

    function deposit(amount, nonce) {
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = fm.toHex(fm.toBig(amount).times(1e18));
      tx.data = generateAbiData({method: "deposit"});
      tx.gasPrice = fm.toHex(fm.toNumber(settings.trading.gasPrice) * 1e9)
      tx.nonce = fm.toHex(nonce)
      return window.WALLET.sendTransaction(tx)
    }

    function withdraw(amount, nonce) {
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
      let wrapAmount = selectedToken.balance;
      let selectMaxWarn = false;
      if(selectedToken.symbol === "ETH") {
        const maxAmount = wrapAmount.minus(0.1);
        wrapAmount = maxAmount.gt(0) ?  maxAmount : fm.toBig(0);
        selectMaxWarn = true
      }
      this.setState({amount: wrapAmount, selectMaxWarn:selectMaxWarn, inputMaxWarn:false})
      form.setFieldsValue({"amount": wrapAmount.toString()})
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

    function toContinue(e) {
      if(e.keyCode === 13) {
        e.preventDefault();
        handleSubmit()
      }
    }

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

    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {math.accMul((this.state.amount >0 ? this.state.amount : convertAmount), prices.getTokenBySymbol(selectedToken.symbol).price).toFixed(2)}
      </span>
    )

    return (
      <Card title={intl.get('token.convert_title')}>
        <div className="row justify-content-center align-items-center">
          <div className="col text-right">
            <div className="text-center d-inline-block mb25" style={{position:'relative'}}>
               <CoinIcon size="60" symbol={selectedToken.symbol === "ETH" ? 'ETH' :'WETH' } color="indigo-500" />
               <span style={{position:'absolute',bottom:"-15px",left:"0",right:"0"}} className="fs14">{selectedToken.symbol === "ETH" ? 'ETH' :'WETH' }</span>
            </div>
          </div>
          <div className="col-auto">
            <i className="icon-loopring icon-loopring-arrow-right color-black-1 fs20"></i>
          </div>
          <div className="col text-left">
            <div className="text-center d-inline-block mb25" style={{position:'relative'}}>
              <CoinIcon size="60" symbol={selectedToken.symbol === "ETH" ? 'WETH' :'ETH' } color="pink-500" />
              <span style={{position:'absolute',bottom:"-15px",left:"0",right:"0"}} className="fs14">{selectedToken.symbol === "ETH" ? 'WETH' :'ETH' }</span>
            </div>
          </div>
        </div>
        <div className="pt10 pb10"></div>
        <Form layout="horizontal">
          <Form.Item colon={false} className="mb0" label={intl.get('token.amount')} {...formItemLayout} extra={
            <div className="row">
              <div className="col-auto">{priceValue}</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>{intl.get('token.convert_max')}</a></div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: adviceConvert.toString(),
              rules: [
                {message: intl.get('token.amount_verification_message'), transform:(value)=>fm.toNumber(value),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input size="large" addonAfter={selectedToken.symbol} onChange={amountChange.bind(this)}
                     onKeyDown={toContinue.bind(this)}
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
                     }}
              />
            )}
          </Form.Item>
          {false && modal.showFrozenAmount && convertAmount>0 &&
            <Form.Item colon={false} className="mb0" label='Notice' {...formItemLayout}>
              <div className="fs12 color-grey-500 mb5">
                <div>Your ETH balance : {ethBalance.balance}</div>
                <div>Your still need to convert : {convertAmount}</div>
                <div>We advice you convert : {adviceConvert}</div>
              </div>
            </Form.Item>
          }
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
            <Button onClick={handleSubmit.bind(this)} type="primary" className="d-block w-100" size="large" loading={this.state.loading}>{intl.get('token.convert_confirm')}</Button>
            {this.state.errorMsg &&
              <div className="fs14 color-red-500 text-center mt10">
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


