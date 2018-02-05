import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/trades/containers';
function Page(props){
  return (
    <div className="">
      <Containers.StandList {...props}>
          <Components.ListActionsBar  />
          <Components.ListTable className="mt15" style={{borderTop:'1px solid #e8e8e8'}}/>
          <Common.ListPagination className="m15 mt25" />
      </Containers.StandList>
    </div>
  )
}

export default Page


