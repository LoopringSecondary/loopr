import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/transactions/containers';

function Page(props){
  return (
    <div className="">

      <Containers.StandList {...props}>
          <Components.ListActionsBar  />
          <Components.ListTable />
          <Common.ListPagination className="" />
      </Containers.StandList>
    </div>
  )
}

export default Page


