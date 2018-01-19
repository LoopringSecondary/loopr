import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button } from 'antd';
import schema from '../../../modules/transactions/schema';

function ListBlock({LIST,actions}) {
  const {
      items=[],
      loading,
      page={}
  } = LIST
  const renders = {
      ringHash:(value,item,index)=><Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/rings/detail/${value}`}>{value}</Link>,
      miner:(value,item,index)=> <Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/miner/detail/${value}`}>{value}</Link>,
      feeRecipient:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
      txHash:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/block/${value}`}>{value}</a>,
      protocol:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
  }
  const actionRender = (value,item,index)=>{
    return <Button>Cancel</Button>
  }
  const actionColumn = {
    title:'Options',
    render:actionRender,
    fixed:'right',
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
  // columns.push(actionColumn)

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
    bordered:true,
  }
  return (
    <div className="">
      <Table {...tableProps}/>  
    </div>
  )
}

ListBlock.propTypes = {
};

export default ListBlock
