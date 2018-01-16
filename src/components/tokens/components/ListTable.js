import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button } from 'antd';
import schema from '../schema';
import tokens from './tokens';

function ListBlock({LIST,actions,modal}) {
  const {
      // items=[],
      loading,
      page={}
  } = LIST
  const items = tokens
  const renders = {
      ringHash:(value,item,index)=><Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/rings/detail/${value}`}>{value}</Link>,
      miner:(value,item,index)=> <Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/miner/detail/${value}`}>{value}</Link>,
      feeRecipient:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
      txHash:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/tx/${value}`}>{value}</a>,
      blockNumber:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/block/${value}`}>{value}</a>,
      protocol:(value,item,index)=> <a className="text-truncate d-block" style={{maxWidth:'150px'}} target="_blank" href={`https://etherscan.io/address/${value}`}>{value}</a>,
      totalLrcFee:(value,item,index)=> (Number(value)/1e18).toFixed(6),
      timestamp:(value,item,index)=> moment(value).format('YYYY/MM/DD HH:mm:ss')
  }
  const showModal = modal.actions && modal.actions.showModal
  if(typeof showModal != 'function'){throw Error('showModal must be a function')}

  const actionRender = (value,item,index)=>{
    return (
      <div>
        <Button className="mr5" onClick={showModal.bind(this,'transfer')}>Transfer</Button>
        <Button className="mr5" icon="qrcode" onClick={showModal.bind(this,'receive')}>Receive</Button>
        <Button className="mr5" hidden onClick={showModal.bind(this,'convert')}>Convert</Button>
        <Button className="mr5" onClick={showModal.bind(this,'approve')}>Approve</Button>
        <Button className="mr5" >Trade</Button>
      </div>
    )
    
  }
  const actionColumn = {
    title:'Options',
    render:actionRender,
    // fixed:'right',
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
  // columns = [...columns,actionColumn]
  columns.push(actionColumn)

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
    size:'small',
    onChange:tableChange,

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
