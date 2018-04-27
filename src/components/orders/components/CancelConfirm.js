import React from 'react'
import {Alert} from 'antd'
import intl from 'react-intl-universal';

export default class CancelConfirm extends React.Component {





  render(){


    return(
      <div>
        <Alert className="mb10" type="info" showIcon message={
          <div className="row">
            <div className="col">
              <div className="">{intl.get('airdrop.cost_eth_gas')}</div>
            </div>
            <div className="col-auto">
              <div className="cursor-pointer">0.000018ETH ≈ $0.12<Icon type="right" className="" /></div>
            </div>
          </div>
        }
        />
      </div>
    )
  }
}
