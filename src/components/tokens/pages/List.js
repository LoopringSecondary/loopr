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
  return (
    <div className="bg-white" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
      <Containers.StandList {...props}>
          <ModalContainer>
            <Components.ListActionsBar  />
            <Components.ListTable />
            <Components.Modals />
          </ModalContainer>
      </Containers.StandList>
    </div>
  )
}

export default Page


