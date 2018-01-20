import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd'
import GlobalFooter from './Footer'
import Navbar from './Navbar'
const { Header, Content, Footer } = Layout


export default function MainLayout(props){
  const { children } = props
  return (
    <Layout className="layout">
      <Header className="bg-blue-500">
        <Navbar />
      </Header>
      <Content className="pl50 pr50 pt30">
        {children}
      </Content>
      <Footer className="">
        <GlobalFooter />
      </Footer>
    </Layout>
  )
}