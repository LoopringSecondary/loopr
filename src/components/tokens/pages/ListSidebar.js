import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ListContainer from '../../../modules/tokens/models/ListContainer';

function Page(props){
  return (
    <div className="">
      <ListContainer {...props}>
        <Components.ListSidebar />
      </ListContainer>
    </div>
  )
}

export default Page


