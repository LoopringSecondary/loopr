import React from 'react';
import actionCreators from '../actionCreators'
import namespace from '../namespace'
const { ListAsync } = window.CONTAINERS
const { MODULES } = namespace

let formatedActionCreators = {
	...actionCreators.list,
	...actionCreators.route,
}

let ListAsyncContainer = ListAsync.createContainer(ListAsync.ByStore,MODULES,formatedActionCreators);

function Container(props){
	let {params={},location={},filters={},sort={},page={}} = props
	let containerProps = {
		filters,page,sort // preset list query
	}
  return (
   	<ListAsyncContainer {...containerProps}  >
   	  {props.children}
   	</ListAsyncContainer>
   )
}
export default Container;


