import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
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
          <Components.List.ListActionsBar  />
          <Empty height="15px" />
          <Components.List.ListTable />
          <Empty height="25px" />
          <Common.ListPagination />
      </Containers.StandList>
    </div>
  )
}

export default ListContainer


