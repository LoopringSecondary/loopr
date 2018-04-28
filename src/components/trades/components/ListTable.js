import React from 'react';
import {Link} from 'dva/router';
import {Button, Table} from 'antd';
import schema from '../../../modules/trades/schema';
import {toNumber, toBig} from 'Loopring/common/formatter';
import intl from 'react-intl-universal';

const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {LIST, actions, className, style} = props;
  const {
    items = [],
    loading,
    page = {}
  } = LIST
  const {dispatch} = props;
  const showModal = (payload = {}) => {
    dispatch({
      type: 'modals/modalChange',
      payload: {
        ...payload,
        visible: true,
      },
    })
  }
  const handleCopy = (value, e) => {
    e.preventDefault();
    e.clipboardData.setData("text", value);
  };
  const renders = {
    ringIndex: (value, item, index) => {
      const gapPosition = item.fillIndex === 0 ? 'top' : 'bottom';
      return (
        <div>
          <a className="text-truncate text-left color-blue-500"
             style={{maxWidth: '150px'}}
             onClick={showModal.bind(this, {id: 'trade/detail', item})}>
            {value}
          </a>
        </div>
      )
    },
    side: (value, item, index) => {
      if (item.side === 'sell') {
        return <div className="color-red-500">{intl.get('orders.side_sell')}</div>
      }
      if (item.side === 'buy') {
        return <div className="color-green-500">{intl.get('orders.side_buy')}</div>
      }
    },
    amount: (value, item, index) => {
      const fmS = item.side.toLowerCase() === 'buy' ? new fm({symbol: item.tokenB}) : new fm({symbol: item.tokenS});
      const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountB) : fmS.getAmount(item.amountS);
      return <span> {uiFormatter.getFormatNum(amount)} {item.side === 'buy' ? item.tokenB : item.tokenS} </span>
    },
    price: (value, item, index) => {
      const tokenB = window.CONFIG.getTokenBySymbol(item.tokenB);
      const tokenS = window.CONFIG.getTokenBySymbol(item.tokenS);
      const market = window.CONFIG.getMarketByPair(item.market);
      const price = item.side.toLowerCase() === 'buy' ? (toBig(item.amountS).div('1e' + tokenS.digits).div(toBig(item.amountB).div('1e' + tokenB.digits))).toFixed(market.pricePrecision) :
        (toBig(item.amountB).div('1e' + tokenB.digits).div(toBig(item.amountS).div('1e' + tokenS.digits))).toFixed(market.pricePrecision);
      return <span> {uiFormatter.getFormatNum(price)} </span>
    },
    total: (value, item, index) => {
      const fmS = item.side.toLowerCase() === 'buy' ? new fm({symbol: item.tokenS}) : new fm({symbol: item.tokenB});
      const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountS) : fmS.getAmount(item.amountB);
      return <span> {uiFormatter.getFormatNum(amount)} {item.side === 'buy' ? item.tokenS : item.tokenB} </span>
    },
    lrcFee: (value, item, index) => {
      const fmLrc = new fm({symbol: 'LRC'});
      return <span> {uiFormatter.getFormatNum(fmLrc.getAmount(item.lrcFee))} {'LRC'} </span>
    },
    lrcReward: (value, item, index) => {
      const fmLrc = new fm({symbol: 'LRC'});
      return <span> {uiFormatter.getFormatNum(fmLrc.getAmount(item.lrcReward))} {'LRC'} </span>
    },
    time: (value, item, index) => {
      return uiFormatter.getFormatTime(toNumber(item.createTime) * 1e3)
    },
  }
  const actionRender = (value, item, index) => {
    return <Button>{intl.get('wallet.cancel')}</Button>
  }
  let columns = schema.map(field => {
    return {
      title: field.title(),
      dataIndex: field.name,
      render: renders[field.name],
      className: 'text-nowrap',
      width: `auto`,
    }
  })
  const tableChange = (pagination, filters, sorter) => {
    // sorder {field,order}
    // filters {field,field}
    const sort = {
      [sorter.field]: sorter.order // TODO
    }
    actions.queryChange({
      sort, filters // TODO
    })
  }
  const tableProps = {
    dataSource: items,
    columns: columns,
    pagination: false,
    loading: loading,
    scroll: {x: true},
    onChange: tableChange,
    bordered: false,
    locale: {emptyText: intl.get('global.no_data')}
  }
  return (
    <div className={className} style={{...style}}>
      <Table {...tableProps}/>
    </div>
  )
}

ListBlock.propTypes = {};

export default ListBlock
