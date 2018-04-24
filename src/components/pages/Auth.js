import React from 'react';
import { Tabs } from 'antd'
import Layout from '../../layout/Layout'
import Wallet from '../wallet/components'
export default function Auth(props){
  const { children,match,location } = props
  return (
    <Layout {...props}>
      <div className="mb50"></div>
      <div className="container">
        <Wallet.Auth />
      </div>
      <div className="mb50"></div>
    </Layout>

  )
}
