import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Badge, Button, Icon, Modal, Popover, Progress, Table, Alert, Spin} from 'antd';
import schema from '../../../../modules/orders/schema';
import {generateCancelOrderTx} from 'Loopring/relay/order'
import {clearPrefix, toHex, toNumber} from "Loopring/common/formatter";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {configs} from "../../../../common/config/data";
import config from "../../../../common/config";
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'
import PropTypes from 'prop-types';


const uiFormatter = window.uiFormatter;
const fm = window.uiFormatter.TokenFormatter;

class ListBlock extends React.Component {

  state = {
    cancelings:[],
  }

  render() {
    const {LIST, actions, className, style, account, gasPrice, contractAddress, txs} = this.props;
    const {dispatch, id} = this.props;
    const _this = this
    const {
      items = [],
      loading,
      page = {}
    } = LIST[id] || {};

    const showModal = (payload = {}) => {
      dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        },
      })
    };


    const cancel = async (item) => {
      const beforeCancel = _this.state.cancelings
      _this.setState({cancelings:[...beforeCancel, item.originalOrder.hash]})
      if (account && account.walletType === 'Address') {
        this.props.dispatch({
          type: 'modals/modalChange',
          payload: {
            id: 'wallet/watchOnlyToUnlock',
            originalData: {},
            pageFrom:'',
            visible: true
          }
        })
        _this.setState({cancelings:[...beforeCancel]})
        return
      };
      const nonce = await window.STORAGE.wallet.getNonce(account.address);
      const originalOrder = {...item.originalOrder};
      originalOrder.marginSplitPercentage = toNumber(originalOrder.marginSplitPercentage);
      originalOrder.owner = originalOrder.address;
      originalOrder.v = toNumber(originalOrder.v);
      originalOrder.tokenB = window.CONFIG.getTokenBySymbol(originalOrder.tokenB).address;
      originalOrder.tokenS = window.CONFIG.getTokenBySymbol(originalOrder.tokenS).address;
      originalOrder.authPrivateKey = clearPrefix(originalOrder.authPrivateKey);
      const tx = generateCancelOrderTx({
        order: originalOrder,
        nonce: toHex(nonce),
        gasPrice: toHex(gasPrice * 1e9),
        gasLimit: config.getGasLimitByType('cancelOrder') ? config.getGasLimitByType('cancelOrder').gasLimit : configs['defaultGasLimit'],
        protocolAddress: contractAddress,
      });
      _this.setState({cancelings:[...beforeCancel]})
      showModal({id: 'order/cancel/confirm', type: 'order', tx, order:item.originalOrder})

      // Modal.confirm({
      //   title: intl.get('order.confirm_cancel_order'),
      //   content:(<div className="">{intl.get('airdrop.cost_eth_gas')}</div>),
      //   onOk: async () => {
      //     const nonce = await window.STORAGE.wallet.getNonce(account.address);
      //     const originalOrder = {...item.originalOrder};
      //     originalOrder.marginSplitPercentage = toNumber(originalOrder.marginSplitPercentage);
      //     originalOrder.owner = originalOrder.address;
      //     originalOrder.v = toNumber(originalOrder.v);
      //     originalOrder.tokenB = window.CONFIG.getTokenBySymbol(originalOrder.tokenB).address;
      //     originalOrder.tokenS = window.CONFIG.getTokenBySymbol(originalOrder.tokenS).address;
      //     originalOrder.authPrivateKey = clearPrefix(originalOrder.authPrivateKey);
      //     const tx = generateCancelOrderTx({
      //       order: originalOrder,
      //       nonce: toHex(nonce),
      //       gasPrice: toHex(gasPrice * 1e9),
      //       gasLimit: config.getGasLimitByType('cancelOrder') ? config.getGasLimitByType('cancelOrder').gasLimit : configs['defaultGasLimit'],
      //       protocolAddress: contractAddress,
      //     });
      //     window.WALLET.sendTransaction(tx).then(({response,rawTx}) => {
      //       if (!response.error) {
      //        // window.STORAGE.transactions.addTx({hash: response.result, owner: account.address});
      //         window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
      //         notifyTransactionSubmitted({txHash:response.result,rawTx,from :window.WALLET.getAddress()}).then(() => {
      //           reEmitPendingTransaction()
      //         });
      //         Notification.open({message: intl.get('order.cancel_order_success'), type: "success",description:(<Button className="alert-btn mr5" onClick={() => window.open(`https://etherscan.io/tx/${response.result}`,'_blank')}> {intl.get('token.transfer_result_etherscan')}</Button> )});
      //       } else {
      //         Notification.open({message: intl.get('order.cancel_order_failed'), type: "error", description:response.error.message})
      //       }
      //     })
      //   },
      //   onCancel: () => {
      //   },
      //   okText: intl.get('order.yes'),
      //   cancelText: intl.get('order.no'),
      // })
      // };

    }
    const handleCopy = (value, e) => {
      e.preventDefault();
      e.clipboardData.setData("text", value);
    };
    const renders = {
      orderHash: (value, item, index) => (
        <a className="text-truncate d-block color-blue-500" onCopy={handleCopy.bind(this, value)}
           style={{maxWidth: '150px'}}
           onClick={showModal.bind(this, {id: 'order/detail', item})}>
          {uiFormatter.getShortAddress(value)}
        </a>
      ),
      market: (value, item, index) => item.originalOrder && item.originalOrder.market,
      status: (value, item, index) => {
        const cancleBtn = (
          <a className="ml5 fs12 color-black-2"
             onClick={cancel.bind(this, item)}>
            {intl.get('order.no')}
          </a>
        )
        let status
        if (item.status === 'ORDER_OPENED') {
          status = <Badge className="fs12" status="processing" text={intl.get('orders.status_opened')}/>
        }
        if (item.status === 'ORDER_FINISHED') {
          status = <Badge className="fs12" status="success" text={intl.get('orders.status_completed')}/>
        }
        if (item.status === 'ORDER_CANCELLED') {
          status = <Badge className="fs12" status="default" text={intl.get('orders.status_canceled')}/>
        }
        if (item.status === 'ORDER_CUTOFF') {
          status = <Badge className="fs12" status="default" text={intl.get('orders.status_canceled')}/>
        }
        if (item.status === 'ORDER_EXPIRE') {
          status = <Badge className="fs12" status="default" text={intl.get('orders.status_expired')}/>
        }
        return (
          <div className="text-left">
            {item.status !== 'ORDER_OPENED' && status}
            {item.status === 'ORDER_OPENED' && (!this.state.cancelings.includes(item.originalOrder.hash) && !txs.isOrderCanceling({
              validSince: item.originalOrder.validSince,
              tokenPair: item.originalOrder.market,
              orderHash: item.originalOrder.hash
            })) &&
              <span>
                {status}
                {cancleBtn}
              </span>
            }
            {item.status === 'ORDER_OPENED' && this.state.cancelings.includes(item.originalOrder.hash) && <span className='fs12 color-black-2 ml5'><Spin size="small"/></span>}
            {item.status === 'ORDER_OPENED' && txs.isOrderCanceling({
              validSince: item.originalOrder.validSince,
              tokenPair: item.originalOrder.market,
              orderHash: item.originalOrder.hash
              }) && <span className='fs12 color-black-2 ml5'>{intl.get('orders.canceling')}</span>
            }
          </div>
        )
      },
      side: (value, item, index) => {
        if (item.originalOrder.side === 'sell') {
          return <div className="color-red-500">{intl.get('orders.side_sell')}</div>
        }
        if (item.originalOrder.side === 'buy') {
          return <div className="color-green-500">{intl.get('orders.side_buy')}</div>
        }
      },
      filled: (value, item, index) => {
        let percent = 0;
        if (!item.originalOrder.buyNoMoreThanAmountB) {
          percent = (item.dealtAmountS / item.originalOrder.amountS * 100).toFixed(1)
        } else {
          percent = (item.dealtAmountB / item.originalOrder.amountB * 100).toFixed(1)
        }
        return <a
          onClick={showModal.bind(this, {id: 'order/detail/fills', item: item, title: intl.get('orders.fill_detail')})}><Progress
          type="circle" percent={Number(percent)} width={36} format={percent => `${percent}%`}/> </a>
      },
      action: (value, item, index) => {
        const tokenS = item.originalOrder.tokenS
        const amountS = item.originalOrder.amountS
        const fm = window.uiFormatter.TokenFormatter
        const fmS = new fm({symbol: tokenS})
        const balance = 100.00
        const required = fmS.getAmount(amountS)
        const lacked = required - balance
        const content = (
          <div className="p10">
            <div className="bg-red-50 pt10 pb10 pl15 pr15 border-red-100"
                 style={{borderRadius: '4px', border: '1px solid'}}>
              <div className="pb5 fs16 color-red-600">
                {intl.get('orders.balance_not_enough', {token: tokenS})}
              </div>
              <div className="pb5 fs12 color-red-400">
                {intl.get('orders.balance')} : <span
                className="font-weight-bold mr10">{window.uiFormatter.getFormatNum(balance)}</span>
                {intl.get('orders.required')} : <span
                className="font-weight-bold mr10">{window.uiFormatter.getFormatNum(required)}</span>
                {intl.get('orders.lacked')}: <span
                className="font-weight-bold mr10">{window.uiFormatter.getFormatNum(lacked)}</span>
              </div>
              <div className="pt5">
                <Button onClick={showModal.bind(this, {id: 'token/receive'})} type="primary"
                        className="bg-red-500 border-none">{intl.get('orders.receive', {token: tokenS})}</Button>
                <span className="color-grey-500 ml5 mr5"> or </span>
                {
                  tokenS !== 'WETH' &&
                  <Button onClick={window.routeActions.gotoPath.bind(this, `/trade/${tokenS}-WETH`)}
                          className="bg-red-500 border-none"
                          type="primary">{intl.get('orders.buy', {token: tokenS})}</Button>
                }
                {
                  tokenS === 'WETH' &&
                  <Button onClick={showModal.bind(this, {id: 'token/convert', item: {symbol: 'ETH'}})}
                          className="bg-red-500 border-none" type="primary">{intl.get('orders.convert')} </Button>
                }
              </div>
            </div>
          </div>
        );

        let notEnough = false && (item.status === 'ORDER_OPENED')
        const cancleBtn = (
          <Button size="small"
                  onClick={cancel.bind(this, item)}
                  loading={txs.isOrderCanceling({
                    validSince: item.originalOrder.validSince,
                    tokenPair: item.originalOrder.market,
                    orderHash: item.originalOrder.hash
                  })}
                  disabled={txs.isOrderCanceling({
                    validSince: item.originalOrder.validSince,
                    tokenPair: item.originalOrder.market,
                    orderHash: item.originalOrder.hash
                  })}>
            {intl.get('order.no')}
          </Button>
        )
        return (
          <span className="text-nowrap">
          {item.status === 'ORDER_OPENED' && cancleBtn}
            {notEnough &&
            <Popover arrowPointAtCenter placement="topRight" content={content}
                     title={
                       <div className="pt5 pb5">
                         <div className="row">
                           <div className="col">
                             {intl.get('orders.token_not_enough')} !
                           </div>
                           <div className="col-auto">
                             <a className="fs12 color-blue-500">Why?</a>
                           </div>
                         </div>
                       </div>
                     }
            >
                <span className="color-red-500">
                  <Icon className="mr5" type="exclamation-circle"/>
                </span>
            </Popover>
            }
        </span>
        )

      },

    }

    let columns = schema.map(field => {
      const renderGenerator = (value, item, index) => {
        if (typeof field.formatter === 'function') {
          value = field.formatter(item)
        }
        const render = renders[field.name]
        if (typeof render === 'function') {
          return render(value, item, index)
        } else {
          return value
        }
      }
      return {
        title: field.title(),
        dataIndex: field.name,
        render: renderGenerator,
        className: 'text-nowrap',
        // width:`${100/(schema.length+1)}%`,
        // width:`auto`,
        // sorter: true,
      }
    })
    const actionColumn = {
      title: intl.get('orders.options'),
      render: renders.action,
      // width:150,
      // fixed: 'right',
    }
    // columns.push(actionColumn)

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
      // className:className,
      dataSource: items,
      columns: columns,
      pagination: false,
      loading: loading,
      scroll: {x: true},
      onChange: tableChange,
      bordered: false,
      size: 'default',
      locale: {emptyText: intl.get('global.no_data')},
      rowKey: (record) => record.originalOrder.hash, // set each record PK ( primary key)
    }

    return (
      <div className={className} style={{...style}}>
        <Table {...tableProps}/>
      </div>

    )
  }
}

ListBlock.propTypes = {};
ListBlock.contextTypes = {
  socket: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    account: state.account,
    gasPrice: state.settings.trading.gasPrice,
    contractAddress: state.settings.trading.contract.address
  };
}

export default connect(mapStateToProps)(ListBlock)
