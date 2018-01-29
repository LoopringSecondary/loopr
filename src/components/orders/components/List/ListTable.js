import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button,Modal } from 'antd';
import schema from '../../../../modules/orders/schema';
const uiFormatter = window.uiFormatter

function ListBlock({LIST,actions,className,style}) {
  const {
      items=[],
      loading,
      page={}
  } = LIST
  const cancelOrder = ()=>{
    Modal.confirm({
        title: 'Do you Want to cancel this order?',
        content: 'Some descriptions',
        onOk:()=>{
          // TODO
          // actions.cancelOrder()
        },
        onCancel:()=>{},
        okText:'Yes',
        cancelText:'No',
    })
  }
  const renders = {
      orderHash:(value,item,index)=>(
          <Link className="text-truncate d-block" style={{maxWidth:'150px'}} to={`/orders/detail/${value}`}>
          {uiFormatter.getShortAddress(value)}
          </Link>
      ),
      status:(value,item,index)=>value,
      side:(value,item,index)=>{
        if(index < 3){
          return <div className="color-green-500">Sell</div>
        }
        if(index >= 3){
          return <div className="color-red-500">Buy</div>
        }
      },
      action:(value,item,index)=><Button onClick={cancelOrder.bind(this,value,item)}>Cancel</Button>,
  }
  let columns = schema.map(field=>{
    const renderGenerator = (value,item,index)=>{
      if(typeof field.formatter === 'function'){
        value = field.formatter(item)
      }
      const render = renders[field.name]
      if(typeof render === 'function'){
        return render(value,item,index)
      }else{
        return value
      }
    }
    return {
        title:field.title,
        dataIndex:field.name,
        render:renderGenerator,
        className:'text-nowrap',
        sorter:true,
    }
  })
  const actionColumn = {
    title:'Options',
    render:renders.action,
    fixed:'right',
  }
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
    // className:className,
    dataSource:items,
    columns:columns,
    pagination:false,
    loading:loading,
    scroll:{x:1000},
    onChange:tableChange,
    bordered:false,
    size:'default',
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
