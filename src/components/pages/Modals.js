import React, { PropTypes } from 'react';
import UserGuide from './UserGuide'
import ModalContainer from '../../modules/modals/container'

function Modals(props){
  return (
    <div>
			<ModalContainer id="userguide">
        <UserGuide />
			</ModalContainer>
    </div>
  );
}

export default Modals;
