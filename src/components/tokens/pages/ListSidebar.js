import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ListContainer from '../../../modules/tokens/models/container';

function Empty(props){
  return <div style={{height:props.height}}></div>
}
function Page(props){
  const filters = {
    ringHash:null
  }
  const containerProps={
    ...props,
    filters
  }
  return (
    <div className="">
      <ListContainer>
        <Components.ListSidebar />
      </ListContainer>
      
      {
        false &&
        <Containers.StandList {...containerProps}>
          <Components.ListSidebar />
        </Containers.StandList>
      }
      
    </div>
  )
}

export default Page


