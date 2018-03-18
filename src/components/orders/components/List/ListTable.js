import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Table, Badge, Button, Modal, Icon, Popover, Steps} from 'antd';
import schema from '../../../../modules/orders/schema';
import {generateCancelOrderTx} from 'Loopring/relay/order'
import {toHex, toNumber,clearPrefix} from "Loopring/common/formatter";
import {configs} from "../../../../common/config/data";
import config from "../../../../common/config";

const uiFormatter = window.uiFormatter;

function ListBlock(props) {
  console.log('ListTable render')
  const {LIST, actions, className, style, account, gasPrice,contractAddress} = props;
  const {
    items = [],
    loading,
    page = {}
  } = LIST;
  const cancel = (item) => {
    Modal.confirm({
      title: 'Do you Want to cancel this order ?',
      content: 'Some descriptions',
      onOk: async () => {
        const nonce = await window.STORAGE.wallet.getNonce(account.address);
        const originalOrder = item.originalOrder;
        originalOrder.marginSplitPercentage = toNumber(originalOrder.marginSplitPercentage);
        originalOrder.owner = originalOrder.address;
        originalOrder.v = toNumber(originalOrder.v);
        originalOrder.tokenB  = window.CONFIG.getTokenBySymbol(originalOrder.tokenB).address;
        originalOrder.tokenS = window.CONFIG.getTokenBySymbol(originalOrder.tokenS).address;
        originalOrder.authPrivateKey = clearPrefix(originalOrder.authPrivateKey);
        const tx = generateCancelOrderTx({
          order: originalOrder,
          nonce: toHex(nonce),
          gasPrice: toHex(gasPrice * 1e9),
          gasLimit: config.getGasLimitByType('cancelOrder') ? config.getGasLimitByType('cancelOrder').gasLimit : configs['defaultGasLimit'],
          protocolAddress: contractAddress,
        });
        window.WALLET.sendTransaction(tx).then((res) => {
          if (!res.error) {
            window.STORAGE.transactions.addTx({hash: res.result, owner: account.address});
            window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce});
            //TODO 跳转到 发送成功的Modal
          }else{
            // TODO 跳转到发送失败的Modal
          }
        })
      },
      onCancel: () => {
      },
      okText: 'Yes',
      cancelText: 'No',
    })
  };
  const handleCopy = (value, e) => {
    e.preventDefault();
    e.clipboardData.setData("text", value);
  };
  const renders = {
    orderHash: (value, item, index) => (
      <Link className="text-truncate d-block" onCopy={handleCopy.bind(this, value)} style={{maxWidth: '150px'}}
            to={`/orders/detail/${value}`}>
        {uiFormatter.getShortAddress(value)}
      </Link>
    ),
    market: (value, item, index) => item.originalOrder && item.originalOrder.market,
    status: (value, item, index) => {
      let status
      if (item.status === 'ORDER_OPENED') { status = <Badge status="processing" text="Opened"/>}
      if (item.status === 'ORDER_FINISHED') { status = <Badge status="success" text="Completed"/>}
      if (item.status === 'ORDER_CANCELED') { status = <Badge status="default" text="Cancelled"/>}
      if (item.status === 'ORDER_EXPIRE') { status = <Badge status="default" text="Expired"/>}
      return (
        <div>
          {status}
        </div>
      )

    },
    side: (value, item, index) => {
      if (item.originalOrder.side === 'sell') {
        return <div className="color-green-500">Sell</div>
      }
      if (item.originalOrder.side === 'buy') {
        return <div className="color-red-500">Buy</div>
      }
    },
    action: (value, item, index) => {
      const content = <div className="p25">
        <Steps current={1} progressDot>
          <Steps.Step title="Allowance"/>
          <Steps.Step title="Balance"/>
          <Steps.Step title="Wrap"/>
        </Steps>
        <div className="p15">
          TODODO
        </div>
      </div>
      let notEnough = !!(item.status === 'ORDER_OPENED')
      return (
        <span>
          { item.status === 'ORDER_OPENED' &&
            <a onClick={cancel.bind(this, value, item)} className="color-blue-600 mr10 border-blue-300" style={{borderRadius:'2px',border:'1px solid',padding:'2px 5px'}}>Cancel</a>
          }
          { notEnough &&
            <span>
              <Popover content={content} title="You Need To Do">
                <div className="color-red-500">
                  <Icon className="mr5" type="exclamation-circle"/>
                </div>
              </Popover>
            </span>
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
      title: field.title,
      dataIndex: field.name,
      render: renderGenerator,
      className: 'text-nowrap',
      sorter: true,
    }
  })
  const actionColumn = {
    title: 'Options',
    render: renders.action,
    fixed: 'right',
  }
  columns.push(actionColumn)

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
    scroll: {x: 1000},
    onChange: tableChange,
    bordered: false,
    size: 'default',
    rowKey: (record) => record.originalOrder.hash, // set each record PK ( primary key)
  }
  return (
    <div className={className} style={{minHeight:'400px',...style}}>
      <Table {...tableProps}/>
    </div>

  )
}

ListBlock.propTypes = {};


function mapStateToProps(state) {
  return {
    account: state.account,
    gasPrice: state.settings.trading.gasPrice,
    contractAddress: state.settings.trading.contract.address
  };
}

export default connect(mapStateToProps)(ListBlock)
