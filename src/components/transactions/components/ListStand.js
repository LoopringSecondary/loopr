import React from 'react';
import {Link} from 'dva/router';
import {Badge, Spin, Alert, Button, Icon} from 'antd';
import ListFiltersFormSimple from './ListFiltersFormSimple'
import CurrencyContainer from '../../../modules/settings/CurrencyContainer'
import intl from 'react-intl-universal'
import CoinIcon from '../../common/CoinIcon'
import {getEstimatedAllocatedAllowance, getFrozenLrcFee} from "Loopring/relay/utils";
import {toBig} from "Loopring/common/formatter";

const uiFormatter = window.uiFormatter;

class ListBlock extends React.Component {

  state = {
    needed: 0,
    token: null
  };

  componentDidMount() {
    const currentToken = window.STORAGE.tokens.getCurrent().toUpperCase();
    getEstimatedAllocatedAllowance(window.WALLET.getAddress(), currentToken).then(res => {
      if (!res.error) {
        const orderAmount = toBig(res.result);
        if (currentToken === 'LRC') {
          getFrozenLrcFee(window.WALLET.getAddress()).then(res => {
            if (!res.error) {
              const lrcFee = toBig(res.result);
              this.setState({needed: orderAmount.plus(lrcFee), token: currentToken});
            } else {
              this.setState({needed: orderAmount, token: currentToken});
            }
          })
        } else {
          this.setState({needed: orderAmount, token: currentToken});
        }
      }
    })
  }


  render() {
    const {LIST, actions, prices, assets} = this.props;
    const {items = [], loading, page = {}, filters} = LIST;
    const {token, needed} = this.state;
    const balance = assets.getTokenBySymbol(token).balance;

    const showModal = (payload) => {
      window.STORE.dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        }
      })
    };

    const gotoReceive = () => {
      showModal({
        id: 'token/receive',
      })
    };
    const gotoConvert = (item) => {
      showModal({
        id: 'token/convert',
        item: {symbol: 'ETH'}
      })
    };
    const gotoTrade = (token) => {
      window.routeActions.gotoPath(`/trade/${token}-WETH`)
    };

    const TxItem = ({item: origin, index}) => {
      let item = {...origin} // fix bug for update item self
      item.symbol = item.symbol || 'NO SYMBOL'
      const tokenFm = new uiFormatter.TokenFormatter({symbol: item.symbol})
      const priceToken = prices.getTokenBySymbol(item.symbol)
      item.guzhi = tokenFm.getAmountValue(origin.value, priceToken.price)
      item.value = tokenFm.getAmount(origin.value)
      let change = '';
      switch (item.type) {
        case 'approve':
          change = '+';
          break;
        case 'send':
          change = '-';
          break;
        case 'receive':
          change = '+';
          break;
        case 'convert_income':
          change = '+';
          break;
        case 'convert_outcome':
          change = '-';
          break;
        default:
          break;
      }
      const statusCol = (
        <span className="text-left">
        {item.status === 'pending' && <Badge status="warning" text={intl.get('txs.status_pending')}/>}
          {item.status === 'success' && <Badge status="success" text={intl.get('txs.status_success')}/>}
          {item.status === 'failed' && <Badge status="error" text={intl.get('txs.status_failed')}/>}
      </span>
      )
      const iconCol = (
        <div className="text-center">
          {item.type === 'approve' && <CoinIcon symbol={item.symbol} size="30"/>}
          {item.type === 'send' && <i className="icon icon-loopring icon-loopring-transfer fs30"/>}
          {item.type === 'receive' && <i className="icon icon-loopring icon-loopring-receive fs30"/>}
          {item.type.startsWith('convert') && <CoinIcon symbol={item.symbol} size="30"/>}
        </div>
      );

      const caption = (
        <div className="">
          <a className="fs2 color-black-1 mb5 d-block pointer">
            {item.type === 'approve' && intl.get('txs.type_enable_title', {symbol: item.symbol})}
            {item.type === 'send' && intl.get('txs.type_transfer_title', {symbol: item.symbol})}
            {item.type === 'receive' && intl.get('txs.type_receive_title', {symbol: item.symbol})}
            {item.type === 'convert_outcome' && item.symbol === 'WETH' && intl.get('txs.type_convert_title_weth')}
            {item.type === 'convert_outcome' && item.symbol === 'ETH' && intl.get('txs.type_convert_title_eth')}
            {item.type === 'convert_income' && item.symbol === 'WETH' && intl.get('txs.type_convert_title_eth')}
            {item.type === 'convert_income' && item.symbol === 'ETH' && intl.get('txs.type_convert_title_weth')}
            {item.type === 'cancel_order' && intl.get('txs.cancel_order')}
            {item.type === 'cutoff' && intl.get('txs.cancel_all')}
            {item.type === 'cutoff_trading_pair' && intl.get('txs.cancel_pair_order', {pair: item.content})}
            {item.type === 'unsupported_contract' && intl.get('txs.unsupported_contract')}
            <span className="ml10">{statusCol}</span>
          </a>
          {
            <div className="fs3 color-black-3">
            <span className="mr15">
              {uiFormatter.getFormatTime(item.createTime * 1000)}
            </span>
              <a href={`https://etherscan.io/tx/${item.from}`} target="_blank"
                 className="color-black-3 mr15  d-inline-block">
                {uiFormatter.getShortAddress(item.txHash)}
              </a>
              {
                false &&
                <span className="mr15 d-inline-block">
                {item.txHash && <span>TxHash: <a href={`https://etherscan.io/tx/${item.txHash}`} target="_blank"
                                                 className="color-blue-500">{uiFormatter.getShortAddress(item.txHash)}</a></span>}
              </span>
              }

              {
                false && item.type === 'send' &&
                <span className="mr15  d-inline-block">
                {item.to && <span>To: <a href={`https://etherscan.io/tx/${item.to}`} target="_blank"
                                         className="color-blue-500">{uiFormatter.getShortAddress(item.to)}</a></span>}
              </span>
              }
              {
                false && item.type === 'receive' &&
                <span className="mr15  d-inline-block">
                {item.from && <span>From: <a href={`https://etherscan.io/tx/${item.from}`} target="_blank"
                                             className="color-blue-500">{uiFormatter.getShortAddress(item.from)}</a></span>}
              </span>
              }
            </div>
          }
        </div>
      )

      return (
        <div className="ml15 mr15 mt15 pb15 zb-b-b">
          <div className="row align-items-center no-gutters flex-nowrap" key={index}>
            <div className="col-auto pr15">
              {iconCol}
            </div>
            <div className="col pr10">
              {caption}
            </div>
            {
              item.type !== 'approve' &&
              <div className="col-auto mr5">
                {change === '+' &&
                <div className="text-right">
                  <div className="fs18 color-green-500 font-weight-bold">
                    + {item.value} {item.symbol}
                  </div>
                  {
                    false &&
                    <div className="fs14 color-green-500">
                      + <CurrencyContainer/>{item.guzhi}
                    </div>
                  }
                </div>
                }
                {change === '-' &&
                <div className="text-right">
                  <div className="fs18 color-red-500 font-weight-bold">
                    - {item.value} {item.symbol}
                  </div>
                  {
                    false &&
                    <div className="fs14 color-red-500">
                      - <CurrencyContainer/> {item.guzhi}
                    </div>
                  }
                </div>
                }
              </div>
            }
          </div>
        </div>

      )
    }
    // background:"rgba(0,0,0,0.02)"
    return (
      <div className="" style={{}}>
        <div className="row zb-b-b p15 no-gutters align-items-center">
          <div className="col">
            <div className="fs2 color-black-1">{filters.token || intl.get('global.all')} {intl.get('txs.title')}</div>
          </div>
          <div className="col-auto" style={{height: '32px'}}>
            <ListFiltersFormSimple actions={actions} LIST={LIST}/>
          </div>
        </div>
        <div style={{}}>
          {
            loading &&
            <div className="p50 text-center">
              <Spin/>
            </div>
          }
          {needed && needed.gt(toBig(balance)) && <Alert type="warning" showIcon closable className="mt15"
                  description={
                    <div className="text-center">
                      <div className="fs16 ">
                        Balance is not enough for orders
                      </div>
                      <div>
                        <Button onClick={gotoReceive} className="m5 color-blue-500">Receive</Button>
                        {token !== 'WETH' && <Button onClick={gotoTrade.bind(this, token)} className="m5 color-blue-500">Buy</Button>}
                        {token === 'WETH' &&<Button onClick={gotoConvert} className="m5 color-blue-500">Convert</Button>}
                      </div>
                    </div>}/>
          }
          {
            items.map((item, index) =>
              <TxItem item={item} key={index} index={index}/>
            )
          }
          {
            items.length === 0 &&
            <div className="text-center pt25 pb25 fs-12 color-grey-400">
              No Transactions
            </div>
          }

        </div>

      </div>
    )
  }
}

export default ListBlock
