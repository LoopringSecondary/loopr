import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button,Modal,Icon,Popover,Steps } from 'antd';
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
      status:(value,item,index)=>{
        const content = <div className="p25">
          <Steps current={1} progressDot>
            <Steps.Step title="Allowance" />
            <Steps.Step title="Balance" />
            <Steps.Step title="Wrap" />
          </Steps>
          <div className="p15">
            TODODO
          </div>
        </div>
        if( index%5 == 0 ) return (
          <Popover content={content} title="You Need To Do">
            <div className="color-red-500">
              <Icon className="mr5" type="exclamation-circle"/> 
              <span className="fs12">UnEnough</span>
            </div>
          </Popover>
        )
        if( index%5 == 1 ) return <Badge status="processing" text="Opened" /> 
        if( index%5 == 2 ) return <Badge status="success" text="Completed" /> 
        if( index%5 == 3 ) return <Badge status="default" text="Cancelled" /> 
        if( index%5 == 4 ) return <Badge status="default" text="Expired" /> 
      },
      side:(value,item,index)=>{
        if(index < 3){
          return <div className="color-green-500">Sell</div>
        }
        if(index >= 3){
          return <div className="color-red-500">Buy</div>
        }
      },
      action:(value,item,index)=>{
        if(index%5 == 0 || index%5 == 1){
         return <Button onClick={cancelOrder.bind(this,value,item)} size="small" className="color-blue-600 border-blue-600">Cancel</Button> 
        }else{
          return null
        }
      },
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
    rowKey:(record)=>record.originalOrder.hash, // set each record PK ( primary key)
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
