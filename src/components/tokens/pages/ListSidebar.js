import React from 'react';
import {Breadcrumb} from 'antd';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';
import ModalContainer from '../../../common/containers/layer/Modal';

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
      <Containers.StandList {...containerProps}>
          <ModalContainer>
            <Components.ListItem />
            <Components.Modals />
          </ModalContainer>
      </Containers.StandList>
    </div>
  )
}

export default Page


