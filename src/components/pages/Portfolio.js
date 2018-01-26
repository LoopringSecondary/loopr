import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon} from 'antd'
import Tokens from '../tokens/pages'
import TokensComp from '../tokens/components'
console.log('TokensComp',TokensComp)
const Portfolio = () => {
  return (
    <div style={{width: "80%",margin:"0 auto"}}>
      <div style={{textAlign:"center"}}>
        <h1>TODO</h1>
      </div>
      <div>
        <TokensComp.ListCard />
        <Tokens.List />
        
      </div>
    </div>
  )
};


export default connect()(Portfolio)
