import React from 'react';
import Components from '../components';
import ListContainer from '../../../modules/tokens/models/ListContainer';
import Sockets from '../../../modules/socket/containers'

function Page(props){
  return (
    <div className="">
      <ListContainer {...props}>
        <Sockets.Prices>
          <Sockets.Assets>
            <Components.ListSidebar />
          </Sockets.Assets>
        </Sockets.Prices>
      </ListContainer>
    </div>
  )
}

export default Page


