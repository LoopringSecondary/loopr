import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/orders/containers';

function Empty(props){
  return <div style={{height:props.height}}></div>
}
function Page(props){
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
          <Components.ListActionsBar  />
          <Empty height="15px" />
          <Components.ListTable />
          <Empty height="25px" />
          <Common.ListPagination />
      </Containers.StandList>
      <div className="test">
        <div>nihao</div>
      </div>
    </div>
  )
}

export default Page


