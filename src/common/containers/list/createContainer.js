import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actionCreators
// 包含 route_action
// 包含 diapatch 的 action （经过程序生成）

export default (ListContainer,MODULES,actionCreators)=>{
  return connect(
    ({[MODULES]:LIST}) => ({LIST}),
    dispatch => ({actions: bindActionCreators(actionCreators, dispatch),dispatch})
  )(ListContainer);
}

