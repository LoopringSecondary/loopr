import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ListContainer from '../../../modules/tokens/models/ListContainer';
import AssetsContainer from '../../../modules/socket/modules/AssetsContainer';

function Page(props){
  return (
    <div className="">
      <ListContainer {...props}>
        <AssetsContainer>
          <Components.ListSidebar />
        </AssetsContainer>
      </ListContainer>
    </div>
  )
}

export default Page


