import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/transactions/containers';

function Page(props){
  return (
    <div className="">
      <Containers.StandList {...props}>
          <Components.ListStand />
          <Common.ListPagination className="mt25 ml15" />
      </Containers.StandList>
    </div>
  )
}

export default Page


