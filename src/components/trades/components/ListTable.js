import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button,Progress } from 'antd';
import schema from '../../../modules/trades/schema';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {LIST, actions, className, style} = props;
  const {
      items=[],
      loading,
      page={}
  } = LIST
  const {dispatch} = props;
  const showModal = (payload={})=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        ...payload,
        visible:true,
      },
    })
  }
  const handleCopy = (value, e) => {
    e.preventDefault();
    e.clipboardData.setData("text", value);
  };
  const renders = {
      ringHash:(value,item,index)=>(
        <a className="text-truncate d-block color-blue-500" onCopy={handleCopy.bind(this, value)} style={{maxWidth: '150px'}}
            onClick={showModal.bind(this,{id:'trade/detail',item})}>
          {uiFormatter.getShortAddress(value)}
        </a>
      ),
      ringHash:(value,item,index)=>(
        <Progress type="circle" percent={100} width={36} format={percent => `#${item.fillIndex+1}`}  />

      ),
      side:(value,item,index)=>{
        if (item.side === 'sell') {
          return <div className="color-green-500">Sell</div>
        }
        if (item.side === 'buy') {
          return <div className="color-red-500">Buy</div>
        }
      },
      size:(value,item,index)=>{
        const fmS = new fm({symbol:item.tokenS})
        return <span> {fmS.getAmount(item.amountS)}  {item.tokenS} </span>
      },
      price:(value,item,index)=>{
        // const fmB = new fm({symbol:item.tokenB})
        // const fmS = new fm({symbol:item.tokenS})
        // const amountS = fmS.getAmount(item.amountS)
        // const amountB = fmB.getAmount(item.amountB)
        return <span> {(item.amountB/item.amountS).toFixed(5)} </span>
      },
      total:(value,item,index)=>{
        const fmB = new fm({symbol:item.tokenB})
        return <span> {fmB.getAmount(item.amountB)}  {item.tokenB} </span>
      },
      lrcFee:(value,item,index)=>{
        const fmLrc = new fm({symbol:'LRC'})
        return <span> {fmLrc.getAmount(item.lrcFee)}  {'LRC'} </span>
      },
      time:(value,item,index)=>{
        return uiFormatter.getFormatTime(item.stimestamp)
      },
  }
  const actionRender = (value,item,index)=>{
    return <Button>Cancel</Button>
  }
  let columns = schema.map(field=>{
    return {
        title:field.title,
        dataIndex:field.name,
        render:renders[field.name],
        className:'text-nowrap',
        sorter:true,
    }
  })
  const tableChange = (pagination, filters, sorter)=>{
    // sorder {field,order}
    // filters {field,field}
    const sort = {
      [sorter.field]:sorter.order // TODO
    }
    actions.queryChange({
      sort,filters // TODO
    })
  }
  const tableProps={
    dataSource:items,
    columns:columns,
    pagination:false,
    loading:loading,
    scroll:{x:1000},
    onChange:tableChange,
    bordered:false,
  }
  return (
    <div className={className} style={{...style}}>
      <Table {...tableProps}/>
    </div>
  )
}

ListBlock.propTypes = {
};

export default ListBlock
