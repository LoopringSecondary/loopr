import React from 'react';
import {Breadcrumb} from 'antd';
import List from '../list';
import Common from '../../common';
import Containers from '../../../modules/orders/containers';

function Empty(props){
  return <div style={{height:props.height}}></div>
}
function ListContainer(props){
  const filters = {
    ringHash:null
  }
  const containerProps={
    ...props,
    filters
  }
  return (
    <div className="">
      <Containers.StandList {...containerProps}>
          <List.ListActionsBar  />
          <Empty height="15px" />
          <List.ListTable />
          <Empty height="25px" />
          <Common.ListPagination />
      </Containers.StandList>
    </div>
  )
}

export default ListContainer


