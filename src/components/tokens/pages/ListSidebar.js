import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ListContainer from '../../../modules/tokens/models/ListContainer';
import Sockets from '../../../modules/socket/containers'
import SettingsContainer from '../../../modules/settings/container'
import AccountContainer from '../../../modules/account/container'

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


