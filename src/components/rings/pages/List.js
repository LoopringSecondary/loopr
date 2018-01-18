import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/rings/containers';
function Page(props){
  const filters = {
    ringHash:null
  }
  const containerProps={
    ...props,
    filters
  }
  return (
    <div>
      <Containers.StandList {...containerProps}>
          <Components.ListTable />
          <Common.ListPagination />
      </Containers.StandList>
    </div>
  )
}

export default Page


