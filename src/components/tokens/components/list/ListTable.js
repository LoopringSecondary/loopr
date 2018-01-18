import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button } from 'antd';
import schema from '../../../../modules/tokens/schema';
import tokens from './tokens';

function ListBlock({LIST,actions,modal}) {
  const {
      // items=[],
      loading,
      page={}
  } = LIST
  const items = tokens
  const renders = {}
  const showModal = modal.showModal
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
