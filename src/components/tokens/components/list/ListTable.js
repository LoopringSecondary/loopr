import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button } from 'antd';
import schema from '../../../../modules/tokens/schema';
import { tokens } from '../../../../common/config/data';

function ListBlock({LIST,actions,modal}) {
  const {
      // items=[],
      loading,
      page={}
  } = LIST
  const items = tokens
  const renders = {}
  

  
  const actionColumn = {
    title:'Options',
    // render:actionRender,
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
    // scroll:{x:1000},
    size:'',
    bordered:false,
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
