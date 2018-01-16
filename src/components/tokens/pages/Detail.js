import React from 'react';
import Components from '../components';
import Common from '../../common';
import Containers from '../../../modules/tokens/containers';

function Page(props){
  const id = props.match && props.match.params && props.match.params.id
  const filters = {
    ringHash:id
  }
  const containerProps={
    ...props,
    filters
  }
  return (
    <Containers.StandList {...containerProps}>
      <Components.Detail />
    </Containers.StandList>
  )
}

export default Page


