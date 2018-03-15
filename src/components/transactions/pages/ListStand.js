import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/transactions/containers';
import Sockets from '../../../modules/socket/containers';

function Page(props){
  return (
    <div className="">
      <Sockets.Transactions {...props}>
          <Components.ListStand />
          <Common.ListPagination className="mt25 ml15" />
      </Sockets.Transactions>
    </div>
  )
}

export default Page


