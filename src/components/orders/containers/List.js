import React from 'react';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/orders/containers';
import Sockets from '../../../modules/socket/containers'

function ListContainer(props) {
  return (
    <div className="">
      <Containers.StandList {...props}>
        <Components.List.ListActionsBar className="mt10 mb10"/>
        <Sockets.PendingTxs>
          <Components.List.ListTable className="" style={{borderTop: '1px solid #e8e8e8'}}/>
        </Sockets.PendingTxs>
        <Common.ListPagination className="m15 mt25"/>
      </Containers.StandList>
    </div>
  )
}

export default ListContainer


