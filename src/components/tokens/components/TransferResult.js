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
  return (
      <Card title="Result">
        <div className="p25 text-center">
          {result.error &&
            <div>
              <div className="fs14 color-grey-900">
                {intl.get('token.result_failed', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error})}
              </div>
            </div>
          }
          {!result.error &&
            <div>
              <Icon className="fs60" type="check-circle"></Icon>
              <div className="fs20 color-grey-900">
                {t} {intl.get('token.completed')}
              </div>
              <div className="fs14 color-grey-900">
                {intl.get('token.result_success', {do:t, amount:result.extraData.amount, token:result.extraData.tokenSymbol})} ({priceValue})
              </div>
              <div>
                <a href={`https://etherscan.io/tx/${result.extraData.txHash}`} target="_blank">{intl.get('token.view_transaction')}</a>
              </div>
            </div>
          }
        </div>
        <div className="row pt40">
          <div className="col pr0">
            {
              result.extraData.pageFrom && result.extraData.pageFrom === 'Transfer' &&
              <Button className="d-block w-100" type="primary" size="large" onClick={sendAgain}>{intl.get('token.send_again')}</Button>
            }
            {
              result.extraData.pageFrom && result.extraData.pageFrom === 'Convert' &&
              <Button className="d-block w-100" type="primary" size="large" onClick={convertAgain}>{intl.get('token.convert_again')}</Button>
            }
          </div>
        </div>
      </Card>
  );
};


export default Preview;


