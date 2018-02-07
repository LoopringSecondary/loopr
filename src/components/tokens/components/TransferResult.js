import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';

let Preview = ({
  modal,
  }) => {
  const {result} = modal
  console.log(result)
  return (
      <Card title="Result">
        <div className="p25 text-center">
          {!result.error &&
            <div>
              <div className="fs14 color-grey-900">
                {"Your hava failed sent "+result.extraData.amount+" "+result.extraData.tokenSymbol+" cause: "+result.error}
              </div>
            </div>
          }
          {result.error &&
            <div>
              <Icon className="fs60" type="check-circle"></Icon>
              <div className="fs20 color-grey-900">
                Send Completed
              </div>
              <div className="fs14 color-grey-900">
                {"You have successfully sent "+result.extraData.amount+" "+result.extraData.tokenSymbol+" (≈USD "+result.extraData.worth+")"}
              </div>
              <div>
                <a href="https://etherscan.io/tx/" target="_blank">View Transaction In Etherscan</a>
              </div>
            </div>
          }
        </div>
        <div className="row pt40">
          <div className="col pr0">
            <Button className="d-block w-100" type="primary" size="large">Send Again</Button>
          </div>
        </div>
      </Card>
  );
};


export default Preview;


