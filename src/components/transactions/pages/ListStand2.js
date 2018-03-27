import React from 'react';
import Components from '../components';
import Common from '../../common';
import Sockets from '../../../modules/socket/containers';

function Page(props){
  return (
    <div className="">
      <Sockets.Transactions {...props}>
        <Sockets.Prices>
          <Sockets.Assets>
            <Components.ListStand2 />
            <Common.ListPagination className="mt25 ml15" />
          </Sockets.Assets>
        </Sockets.Prices>
      </Sockets.Transactions>
    </div>
  )
}

export default Page


