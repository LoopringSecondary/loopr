import React from 'react';
import {Card, Input} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'
import {getEstimatedAllocatedAllowance, getFrozenLrcFee} from 'Loopring/relay/utils'
import {toBig,toNumber} from "Loopring/common/formatter";

const Search = Input.Search;
export default class Receive extends React.Component {

  state = {
    symbol: null,
    amount: 0
  };

  componentDidMount() {
    const {modal} = this.props;
    const {symbol} = modal;
    if (symbol) {
      const _this = this;
      const owner = window.WALLET.getAddress();
      getEstimatedAllocatedAllowance(owner, symbol.toUpperCase()).then(res => {
        if (!res.error) {
          const orderAmount = res.result;
          if (symbol.toUpperCase() === "LRC") {
            getFrozenLrcFee(owner).then(response => {
              let amount;
              if (!response.error) {
                const lrcFee = response.result;
                 amount = toBig(orderAmount).plus(toBig(lrcFee));
              } else {
                 amount = toBig(orderAmount);
              }
              _this.setState({symbol, amount});
            })
          } else {
            const amount = toBig(orderAmount);
            _this.setState({symbol, amount});
          }
        }
      });
    }
  }

  getNeeded = () => {
    const {symbol,amount} = this.state;
    if(symbol){
      const {assets} = this.props;
      const balance = assets ? assets.getTokenBySymbol(symbol).balance : 0;
      const token = window.CONFIG.getTokenBySymbol(symbol);
      return toNumber(toBig(amount).minus(toBig(balance)).div('1e' + token.digits).toFixed(token.precision))
    }
    return 0;
  };

  render() {
    const address = window.WALLET.getAddress();
    const {symbol,amount} = this.state;
    const copyToClipboard = (value) => {
      copy(value) ? Notification.open({
        message: intl.get('navbar.subs.copy_success'),
        type: 'success', size: 'small'
      }) : Notification.open({message: intl.get('navbar.subs.copy_failed'), type: "error", size: 'small'})
    };
    return (
      <Card title={intl.get('token.ethereum_address')}>
        <div className='text-center'>
          <div className='pt30 pb30 pr20 pl20'>
            <QRCode value={address} size={240}/>
            {symbol && amount > 0 && this.getNeeded() > 0  && <div className='fs3 color-black-1 mt10'>
              {intl.get('token.recommended_value')} {this.getNeeded()} {symbol.toUpperCase()}
            </div>}
          </div>
          <Search enterButton={intl.get('token.copy')} value={address} disabled onSearch={copyToClipboard}/>
        </div>
      </Card>

    );
  }
}



