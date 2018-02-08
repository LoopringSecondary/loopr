import React from 'react';
import actionCreators from '../actionCreators'
import namespace from '../namespace'
const { ListAsync } = window.CONTAINERS;
const { MODULES } = namespace;

let formatedActionCreators = {
	...actionCreators.list,
	...actionCreators.route,
}

let ListAsyncContainer = ListAsync.createContainer(ListAsync.ByStore,MODULES,formatedActionCreators);

function Container(props){
  return (
   	<ListAsyncContainer {...props}  >
   	  {props.children}
   	</ListAsyncContainer>
   )
}
export default Container;


