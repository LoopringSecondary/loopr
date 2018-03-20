import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';
import Currency from '../../../modules/settings/CurrencyContainer'
import {accDiv, accMul} from '../../../common/Loopring/common/math'

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
  return (
      <Card title="Result">
        <div className="p25 text-center">
          {result.error &&
            <div>
              <div className="fs14 color-grey-900">
                {`Your hava failed sent ${result.extraData.amount} ${result.extraData.tokenSymbol} cause: ${result.error}`}
              </div>
            </div>
          }
          {!result.error &&
            <div>
              <Icon className="fs60" type="check-circle"></Icon>
              <div className="fs20 color-grey-900">
                Send Completed
              </div>
              <div className="fs14 color-grey-900">
                {`You have successfully sent ${result.extraData.amount} ${result.extraData.tokenSymbol} `} ({priceValue})
              </div>
              <div>
                <a href={`https://etherscan.io/tx/${result.extraData.txHash}`} target="_blank">View Transaction In Etherscan</a>
              </div>
            </div>
          }
        </div>
        <div className="row pt40">
          <div className="col pr0">
            <Button className="d-block w-100" type="primary" size="large" onClick={sendAgain}>Send Again</Button>
          </div>
        </div>
      </Card>
  );
};


export default Preview;


