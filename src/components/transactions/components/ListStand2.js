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
    needed: toBig(0),
    token: null
  };

  componentDidMount() {
    const {LIST} = this.props;
    const {filters} = LIST;
    const {token} = filters;
    if (token) {
      this.getNeeded(token)
    }
  }


  shouldComponentUpdate(nextProps) {
    if (nextProps.LIST.filters.token && nextProps.LIST.filters.token !== this.props.LIST.filters.token) {
      const currentToken = nextProps.LIST.filters.token.toUpperCase();
      this.getNeeded(currentToken)
    }
    return true
  }

  getNeeded = (currentToken) => {

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

  };

  render() {
    const {LIST, actions, prices, assets} = this.props;
    const {items = [], loading, page = {}, filters} = LIST;
    const {token, needed} = this.state;
    const balance = token && assets.getTokenBySymbol(token).balance;
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
    const gotoConvert = () => {
      showModal({
        id: 'token/convert',
        item: {symbol: 'ETH'}
      })
    };
    const gotoTransfer = () => {
      showModal({
        id: 'token/transfer',
        item: {symbol: token}
      })
    };

    const gotoTrade = () => {
      if(token === 'WETH' || token === 'ETH'){
        window.routeActions.gotoPath(`/trade/LRC-WETH`)
      }else{
        window.routeActions.gotoPath(`/trade/${token}-WETH`)
      }

    };

    const TxItem = ({item: origin, index}) => {
      let item = {...origin} // fix bug for update item self
      item.symbol = item.symbol || 'NO SYMBOL'
      const tokenFm = new uiFormatter.TokenFormatter({symbol: item.symbol})
      const priceToken = prices.getTokenBySymbol(item.symbol)
      item.guzhi = tokenFm.getAmountValue(origin.value, priceToken.price)
      item.value = tokenFm.getAmount(origin.value)
      let change
      let icon
      let title
      switch (item.type) {
        case 'approve':
          change = '+'
          icon = <CoinIcon symbol={item.symbol} size="30"/>
          title = intl.get('txs.type_enable_title', {symbol: item.symbol})
          break;
        case 'send':
          change = '-';
          icon = <i className="icon icon-loopring icon-loopring-transfer fs30"/>
          title = intl.get('txs.type_transfer_title', {symbol: item.symbol})
          break;
        case 'receive':
          change = '+';
          icon = <i className="icon icon-loopring icon-loopring-receive fs30"/>
          title = intl.get('txs.type_receive_title', {symbol: item.symbol})
          break;
        case 'convert_income':
          change = '+';
          icon = <i className="icon icon-loopring icon-loopring-convert fs30"/>
          if(item.symbol === 'WETH'){
            title = intl.get('txs.type_convert_title_weth')
          }else{
            title = intl.get('txs.type_convert_title_eth')
          }
          break;
        case 'convert_outcome':
          change = '-';
          icon = <i className="icon icon-loopring icon-loopring-convert fs30"/>
          if(item.symbol === 'WETH'){
            title = intl.get('txs.type_convert_title_weth')
          }else{
            title = intl.get('txs.type_convert_title_eth')
          }
          break;
        case 'cancel_order':
          change = '-';
          icon = <i className="icon icon-loopring icon-loopring-close fs30"/>
          title = intl.get('txs.cancel_order')
          break;
        case 'cutoff':
          change = '-';
          icon = <i className="icon icon-loopring icon-loopring-close fs30"/>
          title = intl.get('txs.cancel_all')
          break;
        case 'cutoff_trading_pair':
          change = '-';
          icon = <i className="icon icon-loopring icon-loopring-close fs30"/>
          title = intl.get('txs.cancel_pair_order',{pair: item.content.market})
          break;
        case 'others':
          change = '-';
          icon = <CoinIcon symbol={item.symbol} size="30"/>
          title = intl.get('txs.others') // TODO
          break;
        default:
          icon = <CoinIcon symbol={item.symbol} size="30"/>
          title = intl.get('txs.others') // TODO
          break;
      }
      const statusCol = (
        <span className="text-left">
        {item.status === 'pending' && <Badge status="warning" text={intl.get('txs.status_pending')}/>}
        {item.status === 'success' && <Badge status="success" text={intl.get('txs.status_success')}/>}
        {item.status === 'failed' && <Badge status="error" text={intl.get('txs.status_failed')}/>}
      </span>
      )
      const caption = (
        <div className="">
          <a onClick={showModal.bind(this,{id:'transaction/detail',item})} className="fs2 color-black-1 hover-color-primary-1 mb5 d-block pointer">
            {title} <span className="ml10">{statusCol}</span>
          </a>
          <div className="fs3 color-black-3">
          <span className="mr15">
            {uiFormatter.getFormatTime(item.createTime * 1000)}
          </span>
          <a onClick={showModal.bind(this,{id:'transaction/detail',item})} target="_blank"
             className="color-black-3 mr15  d-inline-block">
            TxHash: {uiFormatter.getShortAddress(item.txHash)}
          </a>
          </div>
        </div>
      )
      return (
        <div className="mt15 pb15 zb-b-b">
          <div className="row align-items-center no-gutters flex-nowrap" key={index}>
            <div className="col-auto pr15">
              <div className="text-center">
                {icon}
              </div>
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
    return (
      <div className="">
        <div className="row zb-b-b pt15 pb15 ml0 mr0">
          <div className="col-auto pl0 pr0">
            <div className="fs20 color-black-1 font-weight-bold ml15">{filters.token}</div>
          </div>
          <div className="col text-right pl0 pr0">
            <Button onClick={gotoTransfer} className="mr5" type="primary">
              <i className="icon-loopring icon-loopring-transfer fs16 mr5"></i>
              <span style={{position:"relative",top:'-2px'}}>Send {filters.token}</span>
            </Button>
            <Button onClick={gotoReceive} className="mr5" type="primary">
              <i className="icon-loopring icon-loopring-receive fs16 mr5"></i>
              <span style={{position:"relative",top:'-2px'}}>Receive {filters.token}</span>
            </Button>
            <Button onClick={gotoTrade} className="mr15" type="primary">
              <i className="icon-loopring icon-loopring-trade fs16 mr5"></i>
               <span style={{position:"relative",top:'-2px'}}>Buy/Sell {filters.token}</span>
            </Button>

          </div>
        </div>
        <div className="pl15 pr15">
          <div className="zb-b-b row pt10 pb10 no-gutters align-items-center">
            <div className="col">
              <div className="fs2 color-black-1">{intl.get('txs.title')}</div>
            </div>
            <div className="col-auto">
              <ListFiltersFormSimple actions={actions} LIST={LIST} style={{marginTop:'-3px'}}/>
            </div>
          </div>
          {
            loading &&
            <div className="p50 text-center">
              <Spin/>
            </div>
          }
          {!!balance && !!needed.gt(toBig(balance)) &&
          <Alert style={{border: '0px'}} type="warning" showIcon closable
                 description={
                   <div className="text-left">
                     <div className="fs18 color-warning-1">
                       {token} {intl.get('txs.balance_not_enough')}
                     </div>
                     <div>
                       <Button onClick={gotoReceive}
                               className="border-none color-white bg-warning-1">{intl.get('txs.type_receive')} {token}</Button>
                       {token !== 'WETH' && <Button onClick={gotoTrade.bind(this, token)}
                                                    className="m5 border-none color-white bg-warning-1">{intl.get('txs.buy')} {token}</Button>}
                       {token === 'WETH' && <Button onClick={gotoConvert}
                                                    className="m5 border-none color-white bg-warning-1">{intl.get('txs.type_convert_title_eth')}</Button>}
                     </div>
                   </div>
                 }
          />
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
