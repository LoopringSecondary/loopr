import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,ListItem } from 'antd';

function DetailBlock({LIST={},actions={}}) {
  let { items=[],loading } = LIST
  const item = items[0] || {}
  const renders = {
      
  }
  return (
    <div className="">
    </div>
  );
}

export default DetailBlock;
