import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ListContainer from '../../../modules/tokens/models/ListContainer';
import BalancesContainer from '../../../modules/socket/modules/BalancesContainer';

function Page(props){
  return (
    <div className="">
      <ListContainer {...props}>
        <BalancesContainer>
          <Components.ListSidebar />
        </BalancesContainer>
      </ListContainer>
    </div>
  )
}

export default Page


