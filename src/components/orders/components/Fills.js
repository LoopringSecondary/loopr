import React from 'react'
import {getFills} from "Loopring/relay/ring";
import schema from '../../../modules/trades/schema';
import {Table, Pagination, Card} from 'antd';
import {toNumber, toBig} from "Loopring/common/formatter";
import intl from 'react-intl-universal';

const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter
const fillSchema = schema.filter(ele => ele.name !== 'market' && ele.name !== 'side' && ele.name !== 'ringHash');

export default class Fills extends React.Component {

  state = {
    pageSize: 10,
    pageIndex: 1,
    total: 0,
    loading: true,
    fills: []
  };

  componentDidMount() {
    const {pageSize, pageIndex} = this.state;
    getFills({pageSize, pageIndex, orderHash: this.props.modal.item.originalOrder.hash}).then(res => {
      if (!res.error) {
        this.setState({fills: res.result.data, loading: false, total: res.result.total})
      }
    })
  }

  computePrice(item) {
    const fm = window.uiFormatter.TokenFormatter
    let fmS = new fm({symbol: item.tokenS})
    let fmB = new fm({symbol: item.tokenB})

    return item.side.toLowerCase() === 'buy' ?
      toBig(fmS.getAmount(item.amountS)).div(toBig(fmB.getAmount(item.amountB))).toFixed(8) :
      toBig(fmB.getAmount(item.amountB)).div(toBig(fmS.getAmount(item.amountS))).toFixed(8)
  }

  render() {

    const {total, pageSize, pageIndex, loading, fills} = this.state;
    const showModal = (payload = {}) => {
      window.STORE.dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        },
      })
    };
    const handleCopy = (value, e) => {
      e.preventDefault();
      e.clipboardData.setData("text", value);
    };
    const renders = {
      ringHash: (value, item, index) => {
        return (
          <div>
            <a className="text-truncate text-left color-blue-500" onCopy={handleCopy.bind(this, value)}
               style={{maxWidth: '150px'}}
               onClick={showModal.bind(this, {id: 'trade/detail', item})}>
              {uiFormatter.getShortAddress(value)}
            </a>
          </div>
        )
      },
      amount: (value, item, index) => {
        const fmS = item.side === 'buy' ? new fm({symbol: item.tokenB}) : new fm({symbol: item.tokenS});
        const amount = item.side === 'buy' ? fmS.getAmount(item.amountB) : fmS.getAmount(item.amountS);
        return <span> {uiFormatter.getFormatNum(amount)} {item.side === 'buy' ? item.tokenB : item.tokenS} </span>
      },
      price: (value, item, index) => {
        const price = this.computePrice(item);
        return <span> {uiFormatter.getFormatNum(price)} </span>
      },
      total: (value, item, index) => {
        const fmS = item.side === 'buy' ? new fm({symbol: item.tokenS}) : new fm({symbol: item.tokenB});
        const amount = item.side === 'buy' ? fmS.getAmount(item.amountS) : fmS.getAmount(item.amountB);
        return <span> {uiFormatter.getFormatNum(amount)} {item.side === 'buy' ? item.tokenS : item.tokenB} </span>
      },
      lrcFee: (value, item, index) => {
        const fmLrc = new fm({symbol: 'LRC'});
        return <span> {uiFormatter.getFormatNum(fmLrc.getAmount(item.lrcFee))} {'LRC'} </span>
      },
      lrcReward:(value, item, index) => {
        const fmLrc = new fm({symbol: 'LRC'});
        return <span> {uiFormatter.getFormatNum(fmLrc.getAmount(item.lrcReward))} {'LRC'} </span>
      },
      time: (value, item, index) => {
        return uiFormatter.getFormatTime(toNumber(item.createTime) * 1e3)
      },
    };
    let columns = fillSchema.map(field => {
      return {
        title: field.title(),
        dataIndex: field.name,
        render: renders[field.name],
        className: 'text-nowrap',
        width: `auto`,
      }
    });

    const onChange = (page, pageSize) => {

      this.setState({
        loading: true,
        pageIndex: page,
        pageSize: pageSize
      }, () => getFills({pageIndex: page, pageSize: pageSize, orderHash: this.props.orderHash}).then(res => {
        if (!res.error) {
          this.setState({fills: res.result.data, loading: false, total: res.result.total})
        }
      }));
    };

    const tableProps = {
      dataSource: fills,
      columns: columns,
      pagination: false,
      loading: loading,
      scroll: {x: true},
      bordered: false,
      locale: {emptyText: intl.get('global.no_data')}
    };
    return (
      <div>
        {this.props.modal.title &&
        <Card title={this.props.modal.title}>
          <Table  {...tableProps}/>
          {total > pageSize && <Pagination total={total} current={pageIndex} pageSize={pageSize} onChange={onChange}
                                           className='text-right'/>}
        </Card>}
        {!this.props.modal.title && <div>
          <Table  {...tableProps}/>
          {total > pageSize && <Pagination total={total} current={pageIndex} pageSize={pageSize} onChange={onChange}
                                           className='text-right'/>}
        </div>}
      </div>
    )
  }
}

