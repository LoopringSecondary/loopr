import React from 'react';
import { Layout, Menu, Breadcrumb,Alert} from 'antd'
import GlobalFooter from './Footer'
import Navbar from './Navbar'
const { Header, Content, Footer } = Layout

const HomeLayout = (props)=>{
  const { children,location } = props
  return (
    <Layout className="layout">
      <Header className="header-dark position-fixed w-100" style={{zIndex:'100'}}>
        <Navbar {...props}/>
      </Header>
      <Content className="">
        <div className="">
          {children}
        </div>
      </Content>
    </Layout>
  )
}

const MainLayout = (props)=>{
  const { children,location } = props
  return (
    <Layout className="layout">
      <Header className="bg-white">
        <Navbar {...props} />
      </Header>
      <Content className="" style={{background:'#F8F8F8'}}>
        <div className="">
          {children}
        </div>
      </Content>
    </Layout>
  )
}


export default function DefaultLayout(props){
  const { location } = props
  const pathname = location && location.pathname
  const bool =  pathname === '/home' || pathname === '/'
  if(bool){
    return <HomeLayout {...props} />
  }else{
    return <MainLayout {...props} />
  }
}
