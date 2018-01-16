import React from 'react';
import * as apis from '../apis'
const { ListAsync } = window.CONTAINERS

function BaiscListContainer(props){
	let { actions={}} = props
  const asyncProps = {
    actions
  }
  // const asyncProps = {
  //   actions:{
  //     loadItems:apis.getRingMined.bind(this,{
  //       filters:{
  //         ringHash:id
  //       }
  //     })
  //   },
  // }
  return (
      <ListAsync.ByState  {...asyncProps} >
        {this.props.children}
      </ListAsync.ByState>
  )
}

export default BaiscListContainer;


