import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';
import {BigNumber} from 'bignumber.js'
import Transaction from '../../../common/Loopring/ethereum/transaction'

let Preview = ({
  form, modal,
  }) => {
  const {rawTx,extraData} = modal
  //TODO mock
  const privateKey = "93d2d40c13f4d4ca422c154dac7db78f8b0964ad8aa9047c9eb5dfa750357c4e"
  const handelSubmit = async ()=>{
    let tx = new Transaction(rawTx)
    tx.setNonce(extraData.from)
    modal.showLoading({id:'token/transfer/preview'})
    let result = {...rawTx, extraData}
    try {
      await tx.send(privateKey).then(res=>{
        if(res.error) {
          result = {...result, error:res.error.message}
        }
        modal.hideModal({id:'token/transfer/preview'})
        modal.showModal({id:'token/transfer/result', result})
      })
    } catch (e) {
      result = {...result, error:e.message}
      modal.hideModal({id:'token/transfer/preview'})
      modal.showModal({id:'token/transfer/result', result})
    }
  }

  const handelCancel = ()=>{
    modal.hideModal({id:'token/transfer/preview'})
  }

  const MetaItem = (props)=>{
    const {label,value} = props
    return (
      <div className="row pt10 pb10 zb-b-b">
        <div className="col">
          <div className="fs14 color-grey-600">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  const ArrowDivider = (
      <div className="row no-gutters align-items-center">
        <div className="col">
          <hr className="w-100 bg-grey-900"/>
        </div>
        <div className="col-auto">
          <Icon type="right" className="color-grey-900" style={{marginLeft:'-9px'}}></Icon>
        </div>
      </div>
  )
  return (
      <Card title="You are about to send">
        <div className="row flex-nowrap zb-b-b pb30">
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            </div>
          </div>
          <div className="col">
            <div className="text-center">
              <Avatar size="" className="bg-white border-grey-900" src="https://loopring.io/images/favicon.ico"></Avatar>
              <div className="fs12 color-grey-500">{extraData.tokenSymbol}</div>
              {ArrowDivider}
              <div className="fs14 color-grey-900">{extraData.amount+" "+extraData.tokenSymbol+" (≈ $"+extraData.worth+")"}</div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
            </div>
          </div>
        </div>
        <MetaItem label="From" value={extraData.from} />
        <MetaItem label="To" value={rawTx.to} />
        <MetaItem label="Gas" value={
          <div className="mr15">
            <div className="row justify-content-end">{new BigNumber(rawTx.gasPrice.toString()).times(rawTx.gasLimit).times('1e-18') + " ETH"}</div>
            <div className="row justify-content-end fs10 color-dark-text-disabled">{"≈ Gas("+Number(rawTx.gasLimit).toString(10)+") * Gas Price("+Number(rawTx.gasPrice)/(1e9).toString(10)+" gwei)"}</div>
          </div>
        }/>
        <div className="row pt40">
          <div className="col pl0">
            <Button onClick={handelCancel} className="d-block w-100" type="" size="large">No, Cancel It</Button>
          </div>
          <div className="col pr0">
            <Button loading={modal.loading} onClick={handelSubmit} className="d-block w-100" type="primary" size="large">Yes, Send Now</Button>
          </div>
        </div>
      </Card>
  );
};


export default Preview;


