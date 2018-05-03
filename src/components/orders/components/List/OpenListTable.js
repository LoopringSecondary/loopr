import React from 'react';
import {toBig, toNumber} from "../../../../common/Loopring/common/formatter";
import intl from 'react-intl-universal';
import {getOrders} from "Loopring/relay/order";
import {Card, Table, Pagination,Progress} from 'antd';

const scheam = [
  {
    title: () => intl.get('orders.amount'),
    name: 'amount',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase();
      const token = side === 'buy' ? window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB) : window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
      const amount = side === 'buy' ? item.originalOrder.amountB : item.originalOrder.amountS;
      const symbol = side === 'buy' ? item.originalOrder.tokenB : item.originalOrder.tokenS;
      const sideLocale = side === 'sell' ? <span className="color-red-500">{intl.get('orders.side_sell')}</span> :
        <span className="color-green-500">{intl.get('orders.side_buy')}</span>;
      return <div>{sideLocale}  <span>{window.uiFormatter.getFormatNum(toNumber((toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision))) + ' ' + symbol}</span></div>
    }
  },
  {
    title: () => intl.get('orders.price'),
    name: 'price',
    formatter: (item) => {
      const tokenB = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB);
      const tokenS = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
      const market = window.CONFIG.getMarketBySymbol(item.originalOrder.tokenB, item.originalOrder.tokenS);
      const price = item.originalOrder.side.toLowerCase() === 'buy' ?
        toBig(item.originalOrder.amountS).div('1e' + tokenS.digits).div(toBig(item.originalOrder.amountB).div('1e' + tokenB.digits)).toFixed(market.pricePrecision) :
        toBig(item.originalOrder.amountB).div('1e' + tokenB.digits).div(toBig(item.originalOrder.amountS).div('1e' + tokenS.digits)).toFixed(market.pricePrecision);
      return window.uiFormatter.getFormatNum(price)
    }
  },
  {
    title: () => intl.get('orders.total'),
    name: 'total',
    formatter: (item) => {
      const side = item.originalOrder.side.toLowerCase();
      const tokenS = item.originalOrder.tokenS;
      const tokenB = item.originalOrder.tokenB;
      const amountS = item.originalOrder.amountS;
      const amountB = item.originalOrder.amountB;
      let token = side === 'buy' ? window.CONFIG.getTokenBySymbol(tokenS) : window.CONFIG.getTokenBySymbol(tokenB);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? amountS : amountB;
      const symbol = side === 'buy' ? tokenS : tokenB;
      const total = (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision)
      return window.uiFormatter.getFormatNum(toNumber(total)) + ' ' + symbol
    },
  },
  {
    title: () => intl.get('orders.time'),
    name: 'timestamp',
    formatter: (item) => window.uiFormatter.getFormatTime(toNumber(item.originalOrder.validSince) * 1e3),
  },
  {
    title: () => intl.get('orders.filled'),
    name: 'filled',
    formatter:(item) => {
      let percent = 0;
      if (!item.originalOrder.buyNoMoreThanAmountB) {
        percent = (item.dealtAmountS / item.originalOrder.amountS * 100).toFixed(1)
      } else {
        percent = (item.dealtAmountB / item.originalOrder.amountB * 100).toFixed(1)
      }
      return <Progress type="circle" percent={Number(percent)} width={36} format={percent => `${percent}%`}/>
    }
  }
];


export default class OpenListTable extends React.Component {

  state = {
    orders: [],
    loading: true,
    pageIndex: 0,
    pageSize: 20,
    total: 0
  };

   queryOrders = ({pageIndex, pageSize}) => {
    const delegateAddress = window.CONFIG.getDelegateAddress();
    const owner = window.WALLET.getAddress();
    const {modal} = this.props;
    const {token} = modal;
    getOrders({delegateAddress, owner, pageIndex, pageSize, status: 'ORDER_OPENED'}).then(res => {
      if (res.result.data) {
        const orders = res.result.data.filter(order => window.CONFIG.getTokenBySymbol(order.originalOrder.tokenB) && window.CONFIG.getTokenBySymbol(order.originalOrder.tokenB).digits &&
          window.CONFIG.getTokenBySymbol(order.originalOrder.tokenS) && window.CONFIG.getTokenBySymbol(order.originalOrder.tokenS).digits &&
          window.CONFIG.getMarketBySymbol(order.originalOrder.tokenB, order.originalOrder.tokenS) && window.CONFIG.getMarketBySymbol(order.originalOrder.tokenB, order.originalOrder.tokenS).pricePrecision
          && this.orderFilter(order, token));
        this.setState({orders, loading: false, total: orders.length})
      }
    })
  };

  orderFilter = (order, token) => {
    return token.toLowerCase() === 'lrc' ? true : order.originalOrder.tokenS.toLowerCase() === token.toLowerCase()
  };

  componentDidMount() {
    const {pageIndex, pageSize} = this.state;
    this.queryOrders({pageIndex, pageSize})
  }

  onChange = (page, pageSize) => {
    this.setState({
      loading: true,
      pageIndex: page,
      pageSize: pageSize
    }, () => this.queryOrders({pageIndex: page, pageSize: pageSize}))
  };

  render() {
    const {orders, loading, pageSize, total, pageIndex} = this.state;
    const columns = scheam.map(field => {
      const renderGenerator = (value, item, index) => {
        if (typeof field.formatter === 'function') {
          value = field.formatter(item)
        }
      return value
      };
      return {
        title: field.title(),
        dataIndex: field.name,
        render:renderGenerator,
        className: 'text-nowrap',
        width: `auto`,
      }
    });

    const tableProps = {
      dataSource: orders,
      columns: columns,
      pagination: false,
      loading: loading,
      scroll: {x: true},
      bordered: false,
      locale: {emptyText: intl.get('global.no_data')}
    };

    return (
      <Card title={intl.get('orders.open_order_list')}>
        <Table  {...tableProps}/>
        {total > pageSize && <Pagination total={total} current={pageIndex} pageSize={pageSize} onChange={this.onChange}
                                         className='text-right'/>}
      </Card>
    )
  }

}






