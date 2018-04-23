import React from 'react';
import {Button, Card, Form, Input} from 'antd';
import {accMul} from 'Loopring/common/math'
import {toBig, toHex, toNumber,getDisplaySymbol} from "Loopring/common/formatter";
import Currency from '../../../modules/settings/CurrencyContainer'
import wrapArrow from '../../../assets/images/wrap-arrow.png';
import {generateAbiData} from '../../../common/Loopring/ethereum/abi'
import config from '../../../common/config'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import intl from 'react-intl-universal';
import CoinIcon from '../../common/CoinIcon';
import Notification from 'Loopr/Notification'
import * as math from '../../../common/Loopring/common/math'


class WithdrawAll extends React.Component {

  state = {
    errorMsg: ''
  };

  render() {
    const {modal,prices,settings,form} = this.props;
    const selectedToken = modal.item || {};
    const balance = toBig(selectedToken.balance).div(1e18).toNumber();
    const price = prices.getTokenBySymbol('ETH');
    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {accMul(balance,price.price).toFixed(2)}
      </span>
    );

    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    };

    return (
      <Card title={intl.get('token.convert_title')}>
        <div className="row justify-content-center align-items-center mb30">
          <div className="col text-right">
            <div className="text-center d-inline-block">
               <CoinIcon size="60" symbol="WETH" />
                <br/>
                <span className="fs12">Old WETH</span>
            </div>
          </div>
          <div className="col-2">
            <img src={wrapArrow} alt="" style={{height: '14px'}}/>
          </div>
          <div className="col text-left">
            <div className="text-center d-inline-block">
               <CoinIcon size="60" symbol="ETH" />
               <br/>
               <span className="fs12">ETH</span>
            </div>
          </div>
        </div>
        <Form layout="horizontal">
          <Form.Item label={null} colon={false} className="mb0" extra={
            <div className="row">
              <div className="col-auto">{priceValue}</div>
              <div className="col"/>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: balance,
            })(
              <Input placeholder={intl.get('token.amount')} size="large" addonAfter={selectedToken.symbol} disabled />
            )}
          </Form.Item>
          <Form.Item className="mb0 mt15">
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

    function handleSubmit() {
      const _this = this;
      form.validateFields((err, values) => {
        if (!err) {
          let nonce = 0;
          window.STORAGE.wallet.getNonce(window.WALLET.getAddress()).then(result => {
              return withdraw(result);
          }).then(({response,rawTx})=>{
            if (response.error) {
              _this.setState({errorMsg: response.error.message})
            } else {
             // window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
              window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:nonce});
              notifyTransactionSubmitted({txHash:response.result,rawTx,from:window.WALLET.getAddress()});
              modal.hideModal({id:'token/withdrawall'});
              // const result = {extraData:{txHash:res.result, amount:values.amount, price:price.price, tokenSymbol:selectedToken.symbol, pageFrom:'WithdrawAll'}};
              // modal.showModal({id:'token/transfer/result', result});

              const worth = `${getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${math.accMul(values.amount, price.price).toFixed(2)}`;
              Notification.open({
                message:`${intl.get('token.convert_title')} ${intl.get('token.completed')}`,
                description:`${intl.get('token.result_success', {do:intl.get('token.convert_title'), amount:values.amount, token:selectedToken.symbol})} (${worth})`,
                type:'success',
                actions:(
                  <div>
                    <Button className="alert-btn mr5" onClick={() => { window.open(`https://etherscan.io/tx/${response.result}`,'_blank')}}>{intl.get('token.transfer_result_etherscan')}</Button>
                  </div>
                )
              })

            }
          }).catch(error=>{
            console.error(error)
            _this.setState({errorMsg: error.message})
          })
        }
      });
    }

    function withdraw(nonce) {
      const wethConfig = config.getTokenBySymbol(selectedToken.symbol);
      const tx = {};
      tx.to = wethConfig.address;
      tx.value = '0x0';
      tx.data = generateAbiData({method: "withdraw", amount:selectedToken.balance});
      tx.gasPrice = toHex(toNumber(settings.trading.gasPrice) * 1e9);
      tx.nonce = toHex(nonce);
      return window.WALLET.sendTransaction(tx)
    }

  }
}



export default Form.create()(WithdrawAll);
