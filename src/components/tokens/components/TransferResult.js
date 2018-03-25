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
    <span className="fs10">
      ≈
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
  let t = ""
  if(result.extraData.pageFrom === "Transfer") {
    t = intl.get('token.send_title')
  } else if(result.extraData.pageFrom === "Convert") {
    t = intl.get('token.convert_title')
  }
  const TipsContainer = (props)=>(
    <div className="p15 bg-grey-50 mt15" style={{borderRadius:'4px'}}>
      {props.children}
    </div>
  )
  const TipsTitle = (props)=>(
    <div className="fs14 color-black-2 text-left mb5">
      {props.children}
    </div>
  )
  const TipItem = (props)=>(
    <div className="fs14 color-black-2 text-left mb5">
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
                <div className="fs14 color-black-2 mt10">
                  {intl.get('token.result_failed', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error})}
                </div>
                <TipsContainer>
                  <TipsTitle>Tips</TipsTitle>
                  <TipItem>
                    <Icon type="exclamation-circle-o mr5 color-primary-1" />
                    <span className="fs14 color-black-1 fs14 ">If you want to go on do this</span>
                    <a className="fs14 ml15 color-primary-1">
                      Go to send
                      <Icon type="right" />
                    </a>
                  </TipItem>
                  <TipItem>
                    <Icon type="close-circle-o" className="color-red-500 mr5" />
                    <span className="fs14 color-black-1 fs14">Some errors happened for </span>
                    <a className="fs14 ml15 color-primary-1">
                      Do someting
                      <Icon type="right" />
                    </a>
                  </TipItem>

                </TipsContainer>
              </div>
            </div>
          }
          {!result.error &&
            <div>
              <Icon className="fs60" type="check-circle color-green-1 mb15"></Icon>
              <div className="fs20 color-black-2 font-weight-bold">
                {t} {intl.get('token.completed')}
              </div>
              <div className="fs14 color-black-3">
                {intl.get('token.result_success', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol})} ({priceValue})
              </div>
              <TipsContainer>
                <TipsTitle>Tips</TipsTitle>
                <TipItem>
                  <Icon type="exclamation-circle-o mr5 color-primary-1" />
                  <span className="fs14 color-black-1 fs14 ">If you want to go on do this</span>
                  <a className="fs14 ml15 color-primary-1">
                    Go to send
                    <Icon type="right" />
                  </a>
                </TipItem>
                <TipItem>
                  <Icon type="close-circle-o" className="color-red-500 mr5" />
                  <span className="fs14 color-black-1 fs14">Some errors happened for </span>
                  <a className="fs14 ml15 color-primary-1">
                    Do someting
                    <Icon type="right" />
                    {
                      false &&
                      <a href={`https://etherscan.io/tx/${result.extraData.txHash}`} target="_blank">{intl.get('token.view_transaction')}</a>
                    }
                  </a>
                </TipItem>

              </TipsContainer>
            </div>
          }
          <div className="row pt20 pb20">
            <div className="col">
              {
                result.extraData.pageFrom && result.extraData.pageFrom === 'Transfer' &&
                <Button className="d-block w-100" type="primary" size="large" onClick={sendAgain}>OK</Button>
              }
              {
                result.extraData.pageFrom && result.extraData.pageFrom === 'Convert' &&
                <Button className="d-block w-100" type="primary" size="large" onClick={convertAgain}>OK</Button>
              }
            </div>
          </div>
        </div>

      </Card>
  );
};


export default Preview;


