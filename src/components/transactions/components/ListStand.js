import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover,Select,Spin } from 'antd';
import schema from '../../../modules/transactions/schema';
import ListFiltersFormSimple from './ListFiltersFormSimple'
import iconTransfer from '../../../assets/images/icon-tx-type-transfer.png'
import iconReceive from '../../../assets/images/icon-tx-type-receive.png'
import iconTrade from '../../../assets/images/icon-tx-type-trade.png'
import CurrencyContainer from '../../../modules/settings/CurrencyContainer'
import intl from 'react-intl-universal'
import CoinIcon from '../../common/CoinIcon'
const uiFormatter = window.uiFormatter

function ListBlock({LIST,actions,prices}) {
  const {
      items=[],
      loading,
      page={},
      filters,
  } = LIST

  const TxItem = ({item:origin,index})=>{
    let item = {...origin} // fix bug for update item self
    item.symbol = item.symbol || 'NO SYMBOL'
    const tokenFm = new uiFormatter.TokenFormatter({symbol:item.symbol})
    const priceToken = prices.getTokenBySymbol(item.symbol)
    item.guzhi = tokenFm.getAmountValue(origin.value,priceToken.price)
    item.value = tokenFm.getAmount(origin.value)
    let change = ''
     switch (item.type) {
      case 'approve':
        change = '+'
        break;
      case 'send':
        change = '-'
        break;
      case 'receive':
        change = '+'
        break;
      case 'convert':
        change = '-'
        break;
      default:
        break;
    }
    const statusCol = (
      <div className="text-left" style={{width:'85px'}}>
        { item.status === 'pending' && <Badge status="warning" text={intl.get('txs.status_pending')} /> }
        { item.status === 'success' && <Badge status="success" text={intl.get('txs.status_success')} /> }
        { item.status === 'failed' && <Badge status="error" text={intl.get('txs.status_failed')} /> }
      </div>
    )
    const iconCol = (
      <div className="text-center">
        { item.type === 'approve' && <CoinIcon symbol={item.symbol} size="30" /> }
        { item.type === 'send' && <img src={iconTransfer} alt="" style={{width:'30px'}} /> }
        { item.type === 'receive' && <img src={iconReceive} alt="" style={{width:'30px'}} /> }
        { item.type === 'convert' && <CoinIcon symbol={item.symbol} size="30" /> }
      </div>
    )

    const caption = (
      <div className="">
        <div className="fs16 color-grey-700 mb5">
          {item.type === 'approve' && intl.get('txs.type_enable_title',{symbol:item.symbol})}
          {item.type === 'send' && `${intl.get('txs.type_transfer')} ${item.symbol}`}
          {item.type === 'receive' && `${intl.get('txs.type_receive')} ${item.symbol}`}
          {item.type === 'convert' && item.symbol==='WETH' && intl.get('txs.type_convert_title_weth')}
          {item.type === 'convert' && item.symbol==='ETH' && intl.get('txs.type_convert_title_eth')}
        </div>
        {
          <div className="fs12 color-grey-400 ">
            <span className="mr15">
              {uiFormatter.getFormatTime(item.createTime*1000)}
            </span>
            <span className="mr15 d-inline-block">
              {item.txHash && <span>TxHash: <a href={`https://etherscan.io/tx/${item.txHash}`} target="_blank" className="color-blue-500">{uiFormatter.getShortAddress(item.txHash)}</a></span>}
            </span>
            {
              item.type === 'send' &&
              <span className="mr15  d-inline-block">
                {item.to && <span>To: <a href={`https://etherscan.io/tx/${item.to}`} target="_blank" className="color-blue-500">{uiFormatter.getShortAddress(item.to)}</a></span>}
              </span>
            }
            {
              item.type === 'receive' &&
              <span className="mr15  d-inline-block">
                {item.from && <span>From: <a href={`https://etherscan.io/tx/${item.from}`} target="_blank" className="color-blue-500">{uiFormatter.getShortAddress(item.from)}</a></span>}
              </span>
            }

          </div>
        }
      </div>
    )

    return (
      <div className="row align-items-center no-gutters flex-nowrap zb-b-b p15" key={index}>
        <div className="col-auto">
          {statusCol}
        </div>
        <div className="col-auto pr15">
          {iconCol}
        </div>
        <div className="col pr10">
          {caption}
        </div>
        {
          item.type !== 'approve' &&
          <div className="col-auto mr5">
            { change === '+' &&
              <div className="text-right">
                <div className="fs18 color-green-500 mb5">
                  + {item.value} {item.symbol}
                </div>
                <div className="fs14 color-green-500">
                  + <CurrencyContainer />{item.guzhi}
                </div>
              </div>
            }
            { change === '-' &&
              <div className="text-right">
                <div className="fs18 color-red-500 mb5">
                  - {item.value} {item.symbol}
                </div>
                <div className="fs14 color-red-500">
                  - <CurrencyContainer /> {item.guzhi}
                </div>
              </div>
            }
          </div>
        }

      </div>
    )
  }

  return (
    <div className="">
      <div className="row zb-b-b p15 no-gutters align-items-center">
        <div className="col">
          <div className="fs18 color-grey-900">{filters.token || intl.get('global.all')} {intl.get('txs.title')}</div>
        </div>
        <div className="col-auto" style={{height:'32px'}}>
            <ListFiltersFormSimple actions={actions} LIST={LIST} />
        </div>
      </div>
      <div style={{}}>
        {
          loading &&
          <div className="p50 text-center">
            <Spin />
          </div>
        }
        {
          items.map((item,index)=>
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

export default ListBlock
