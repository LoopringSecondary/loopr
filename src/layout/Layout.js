import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd'
import GlobalFooter from './Footer'
import Navbar from './Navbar'
import SettingModal from '../components/pages/Settings'
const { Header, Content, Footer } = Layout


const HomeLayout = (props)=>{
	const { children,location } = props
	return (
		<Layout className="layout">
		  <Header className="bg-white position-fixed w-100" style={{zIndex:'100'}}>
		    <Navbar />
		  </Header>
		  <Content className="">
		    <div className="">
		      {children}
		    </div>
		  </Content>
		  <GlobalFooter />
		  <SettingModal />
		</Layout>
	)
}

const MainLayout = (props)=>{
	const { children,location } = props
	return (
		<Layout className="layout">
		  <Header className="bg-white">
		    <Navbar />
		  </Header>
		  <Content className="" style={{background:'#F8F8F8'}}>
		    <div className="">
		      {children}
		    </div>
		  </Content>
		  <SettingModal />
		</Layout>
	)
}


export default function DefaultLayout(props){
	const { location } = props
  if(location && location.pathname == ('/home' || '/') ){
  	return <HomeLayout {...props} />
  }else{
  	return <MainLayout {...props} />
  }
}