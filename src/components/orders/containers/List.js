import React from 'react';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/orders/containers';
function ListContainer(props){
  return (
    <div className="">
      <Containers.StandList {...props}>
          <Components.List.ListActionsBar className="mt10 mb10" />
          <Components.List.ListTable className="" style={{borderTop:'1px solid #e8e8e8'}} />
          <Common.ListPagination className="m15 mt25" />
      </Containers.StandList>
    </div>
  )
}

export default ListContainer


