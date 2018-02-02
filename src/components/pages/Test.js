import React from 'react';
import { Button } from 'antd'
import { connect } from 'dva'

function Test(props){
  const { dispatch } = props
  let bool = false
  const toggleCurrency = ()=>{
    bool = !bool
    // console.log('bool',bool)
    dispatch({
      type:'global/currencyChange',
      payload:{
        currency:'USD'
      }
    })
  }
  return (
    <div className="container p30">
      <Button onClick={toggleCurrency}>Change Currency</Button>
    </div>
    
  )
}

export default connect()(Test)