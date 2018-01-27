import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd'
import GlobalFooter from './Footer'
import Navbar from './Navbar'
import SettingModal from '../components/pages/Settings'
const { Header, Content, Footer } = Layout

export default function MainLayout(props){
  const { children } = props
  return (
    <Layout className="layout">
      <Header className="bg-white">
        <Navbar />
      </Header>
      <Content className="">
        {children}
      </Content>
      <GlobalFooter />
      <SettingModal />
    </Layout>
  )
}