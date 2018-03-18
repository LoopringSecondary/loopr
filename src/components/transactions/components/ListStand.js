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
        { item.status === 'pending' && <Badge status="warning" text="Pending" /> }
        { item.status === 'success' && <Badge status="success" text="Success" /> }
        { item.status === 'failed' && <Badge status="error" text="Failed" /> }
      </div>
    )
    const iconCol = (
      <div className="text-center">
        { item.type === 'approve' && <img src={iconTransfer} alt="" style={{width:'30px'}} /> }
        { item.type === 'send' && <img src={iconReceive} alt="" style={{width:'30px'}} /> }
        { item.type === 'receive' && <img src={iconTrade} alt="" style={{width:'30px'}} /> }
        { item.type === 'convert' && <img src={iconTrade} alt="" style={{width:'30px'}} /> }
      </div>
    )

    const caption = (
      <div className="">
        <div className="fs20 color-grey-900 mb5">
          {item.type === 'approve' && `Enable ${item.symbol}`}
          {item.type === 'send' && `Send ${item.symbol}`}
          {item.type === 'receive' && `Received ${item.symbol}`}
          {item.type === 'convert' && `Convert WETH To ETH`}
        </div>
        {
          <div className="fs14 color-grey-400 text-nowrap text-truncate">
            <span className="mr15">
              {item.from && `From: ${uiFormatter.getShortAddress(item.from)}`}
            </span>
            <span>
              {item.to && `To: ${uiFormatter.getShortAddress(item.to)}`}
            </span>
          </div>
        }
        <div className="fs14 color-grey-400 text-nowrap text-truncate mt5">
          {uiFormatter.getFormatTime(item.createtime)}
          {
            false &&
            <span>3 mins ago ( 2018-01-20 10:00:00 )</span>
          }
        </div>
      </div>
    )

    return (
      <div className="row align-items-center no-gutters flex-nowrap zb-b-b p20" key={index}>
        <div className="col-auto">
          {statusCol}
        </div>
        <div className="col-auto pr15">
          {iconCol}
        </div>
        <div className="col pr10">
          {caption}
        </div>
        <div className="col"></div>
        <div className="col-auto mr5">
          { change === '+' &&
            <div className="text-right">
              <div className="fs20 color-green-500 mb10">
                + {item.value} {item.symbol}
              </div>
              <div className="fs16 color-green-500">
                + <CurrencyContainer />{item.guzhi}
              </div>
            </div>
          }
          { change === '-' &&
            <div className="text-right">
              <div className="fs20 color-red-500 mb10">
                - {item.value} {item.symbol}
              </div>
              <div className="fs16 color-red-500">
                - <CurrencyContainer /> {item.guzhi}
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="row zb-b-b p15 no-gutters align-items-center">
        <div className="col">
          <div className="fs20 color-grey-900">{filters.token || 'All'} Transactions</div>
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
