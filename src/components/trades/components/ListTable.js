import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button } from 'antd';
import schema from '../../../modules/trades/schema';
const uiFormatter = window.uiFormatter

function ListBlock({LIST,actions,className,style}) {
  const {
      items=[],
      loading,
      page={}
  } = LIST
  const renders = {
      ringHash:(value,item,index)=>(
        <Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/rings/detail/${value}`}>
          {uiFormatter.getShortAddress(value)}
        </Link>
      ),
      side:(value,item,index)=>{
        if(index < 3){
          return <div className="color-green-500">Sell</div>
        }
        if(index >= 3){
          return <div className="color-red-500">Buy</div>
        }
      },
      miner:(value,item,index)=> <Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/miner/detail/${value}`}>{value}</Link>,
      feeRecipient:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
      txHash:(value,item,index)=> 
      <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/tx/${value}`}>
      {uiFormatter.getShortAddress(value)}
      </a>,
      blockNumber:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/block/${value}`}>{value}</a>,
      protocol:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>
      {uiFormatter.getShortAddress(value)}
      </a>,

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
    <div className={className} style={style}>
      <Table {...tableProps}/>  
    </div>
  )
}

ListBlock.propTypes = {
};

export default ListBlock
