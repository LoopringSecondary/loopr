import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';
import Currency from '../../../modules/settings/CurrencyContainer'
import {accDiv, accMul} from '../../../common/Loopring/common/math'
import intl from 'react-intl-universal';

let Preview = ({
  modal,
  }) => {
  const {result} = modal
  const priceValue = (
    <span className="">
      <Currency />
      {accMul(result.extraData.amount, result.extraData.price).toFixed(2)}
    </span>
  )
  const sendAgain = () => {
    modal.hideModal({id:'token/transfer/result'})
    modal.showModal({id:'token/transfer'})
  }
  const convertAgain = () => {
    modal.hideModal({id:'token/transfer/result'})
    modal.showModal({id:'token/convert'})
  }
  const close = () => {
    modal.hideModal({id:'token/transfer/result'})
  }
  let t = ""
  if(result.extraData.pageFrom === "Transfer") {
    t = intl.get('token.send_title')
  } else if(result.extraData.pageFrom === "Convert") {
    t = intl.get('token.convert_title')
  }
  const TipsContainer = (props)=>(
    <div className="p10 bg-grey-50 mt15" style={{borderRadius:'4px'}}>
      {props.children}
    </div>
  )
  const TipsTitle = (props)=>(
    <div className="fs14 color-black-2 text-left m5">
      {props.children}
    </div>
  )
  const TipItem = (props)=>(
    <div className="fs14 color-black-2 text-left m5">
      {props.children}
    </div>
  )
  return (
      <Card title="Result">
        <div className="p25 text-center">
          {result.error &&
            <div>
              <div className="fs14 color-grey-900">
                <Icon className="fs60 color-red-500" type="close-circle"></Icon>
                <div className="fs24 color-black-1 mt15">Send Failed</div>
                <div className="fs14 color-black-3 mt10">
                  {intl.get('token.result_failed', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error})}
                </div>

              </div>
            </div>
          }
          {!result.error &&
            <div>
              <Icon className="fs60" type="check-circle color-success-1 mb15"></Icon>
              <div className="fs20 color-black-1 font-weight-bold">
                {t} {intl.get('token.completed')}
              </div>
              <div className="fs14 color-black-3">
                {intl.get('token.result_success', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol})} ({priceValue})
              </div>
              <TipsContainer>
                <div className="fs14 color-black-2 text-left m5">
                  {
                    false &&
                    <Icon type="close-circle-o" className="color-error-1 mr5" />
                  }
                  <Icon type="exclamation-circle-o mr5 color-primary-1" />
                  <span className="fs14 color-black-1 fs14 ">{intl.get('token.transfer_result_title')}</span>
                  <a className="fs14 ml15 color-primary-1" target="_blank" href={`https://etherscan.io/tx/${result.extraData.txHash}`}>
                    {intl.get('token.transfer_result_etherscan')}
                    <Icon type="right" />
                  </a>
                </div>
                <div className="fs14 color-black-2 text-left m5">
                  {
                    false &&
                    <Icon type="close-circle-o" className="color-error-1 mr5" />
                  }
                  <Icon type="exclamation-circle-o mr5 color-primary-1" />
                  <span className="fs14 color-black-1 fs14">{intl.get('token.transfer_again_title')}</span>
                  {
                    result.extraData.pageFrom && result.extraData.pageFrom === 'Transfer' &&
                    <a className="fs14 ml15 color-primary-1" onClick={sendAgain}>{intl.get('token.transfer_again_send')}<Icon type="right" /></a>
                  }
                  {
                    result.extraData.pageFrom && result.extraData.pageFrom === 'Convert' &&
                    <a className="fs14 ml15 color-primary-1" onClick={convertAgain}>{intl.get('token.transfer_again_convert')}<Icon type="right" /></a>
                  }
                </div>
              </TipsContainer>

            </div>
          }
          <div className="row pt20">
            <div className="col">
              <Button className="d-block w-100" type="primary" size="large" onClick={close}>OK</Button>
            </div>
          </div>
        </div>

      </Card>
  );
};


export default Preview;


