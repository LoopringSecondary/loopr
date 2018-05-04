import React from 'react';
import { Avatar,Icon,Button,Card,Modal } from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'
import Currency from '../../../modules/settings/CurrencyContainer'
import {accDiv, accMul} from '../../../common/Loopring/common/math'
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import intl from 'react-intl-universal';
import CoinIcon from '../../common/CoinIcon'
import Notification from 'Loopr/Notification'

let Preview = ({
  modal, account,modals
  }) => {
  const {tx,extraData} = modal
  const viewInEtherscan = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`,'_blank')
  }
  const handelSubmit = ()=>{
    modal.showLoading({id:'token/transfer/preview'})
    extraData.pageFrom = "Transfer"
    let result = {...tx, extraData}
    // To test Ledger
    // tx.chainId = 1
    window.STORAGE.wallet.getNonce(account.address).then(nonce => {
      tx.nonce = fm.toHex(nonce)
      let toConfirmWarn = '';
      if (window.WALLET_UNLOCK_TYPE === 'Ledger') {
        toConfirmWarn = intl.get('trade.confirm_warn_ledger')
      }
      if (window.WALLET_UNLOCK_TYPE === 'MetaMask') {
        toConfirmWarn = intl.get('trade.confirm_warn_metamask')
      }
      if (window.WALLET_UNLOCK_TYPE === 'Trezor') {
        toConfirmWarn = intl.get('trade.confirm_warn_trezor')
      }
      if (toConfirmWarn) {
        Notification.open({
          duration:0,
          message: intl.get('trade.to_confirm_title'),
          description: toConfirmWarn,
          type: 'info'
        })
      }
      return window.WALLET.sendTransaction(tx)
    }).then(({response,rawTx})=>{
      if(response.error) {
        result = {...result, error:response.error.message}
        Notification.open({
          message:intl.get('token.send_failed'),
          description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
          type:'error'
        })
      } else {
        extraData.txHash = response.result
      //  window.STORAGE.transactions.addTx({hash: response.result, owner: account.address})
        window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce})
        notifyTransactionSubmitted({rawTx,txHash:response.result,from:window.WALLET.getAddress()});
        const worth = `${fm.getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${accMul(result.extraData.amount, result.extraData.price).toFixed(2)}`
        Notification.open({
          message:intl.get('token.transfer_succ_notification_title'),
          description:intl.get('token.result_transfer_success', {amount:result.extraData.amount, token:result.extraData.tokenSymbol}),
          type:'success',
          actions:(
            <div>
              <Button className="alert-btn mr5" onClick={viewInEtherscan.bind(this, extraData.txHash)}>{intl.get('token.transfer_result_etherscan')}</Button>
            </div>
          )
        })
      }
      modal.hideLoading({id:'token/transfer/preview'})
      modal.hideModal({id:'token/transfer/preview'})
      modal.hideModal({id: 'token/transfer'})
      // modal.showModal({id:'token/transfer/result', result})
    }).catch(e=>{
      console.error(e)
      result = {...result, error:e.message}
      modal.hideLoading({id:'token/transfer/preview'})
      modal.hideModal({id:'token/transfer/preview'})
      modal.hideModal({id: 'token/transfer'})
      // modal.showModal({id:'token/transfer/result', result})
      Notification.open({
        message:intl.get('token.send_failed'),
        description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
        type:'error'
      })
    })
  }
  const handelCancel = ()=>{
    modal.hideModal({id:'token/transfer/preview'});
  };
  const MetaItem = (props)=>{
    const {label,value} = props
    return (
      <div className="row pt10 pb10 zb-b-b align-items-center">
        <div className="col">
          <div className="fs14 color-black-1">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-black-1">{value}</div>
        </div>
      </div>
    )
  }
  const priceValue = (
    <span className="">
      <Currency />
      {accMul(extraData.amount, extraData.price).toFixed(2)}
    </span>
  )
  return (
    <Card title={intl.get('token.transfer_preview_title')}>
      <div className="row flex-nowrap pb30 zb-b-b">
        <div className="col">
          <div className="text-center">
            <CoinIcon size="60" symbol={extraData.tokenSymbol} />
            <div className="fs20 color-black font-weight-bold">{`${window.uiFormatter.getFormatNum(extraData.amount)} ${extraData.tokenSymbol} `}</div>
            <div className="fs14 color-black-3">{priceValue}</div>
          </div>
        </div>
      </div>
      <MetaItem label={intl.get('token.from')} value={extraData.from} />
      <MetaItem label={intl.get('token.to')} value={extraData.to} />
      <MetaItem label={intl.get('token.gas')} value={
        <div className="mr15">
          <div className="row justify-content-end">{`${fm.toBig(tx.gasPrice.toString()).times(tx.gasLimit).times('1e-18').toString(10)}  ETH`}</div>
          <div className="row justify-content-end fs14 color-black-3">{`Gas(${fm.toNumber(tx.gasLimit).toString(10)}) * Gas Price(${fm.toNumber(tx.gasPrice)/(1e9).toString(10)} Gwei)`}</div>
        </div>
      }/>
      <div className="row pt30 pb10">
        <div className="col pl15">
          <Button onClick={handelCancel} className="d-block w-100" type="" size="large">{intl.get('token.transfer_cancel')}</Button>
        </div>
        <div className="col pr15">
          <Button loading={modal.loading} onClick={handelSubmit} className="d-block w-100" type="primary" size="large">{intl.get('token.transfer_send')}</Button>
        </div>
      </div>
    </Card>
  );
};


export default Preview;


