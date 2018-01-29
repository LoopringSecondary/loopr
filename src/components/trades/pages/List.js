import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/trades/containers';

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
          <Components.ListTable className="mt15" style={{borderTop:'1px solid #e8e8e8'}}/>
          <Common.ListPagination className="mt25 ml15" />
      </Containers.StandList>
    </div>
  )
}

export default Page


