import React from 'react';
import {Menu} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo@2x.png'
export default function Navbar(props){
  return (
    <div className="">
      <div className="row pl15 pr15 align-items-stretch">
        <div className="col-auto pl0 pr0">
          <a href="/" className="d-block" >
            <img src="https://loopring.io/images/logo.svg" alt="" style={{height:'38px'}} />
          </a>
        </div>
        <div className="col-auto" hidden>
          <div className="color-grey-400 fs16">
            A Looring Ring Explorer
          </div>
        </div>
        <div className="col">
          <Menu
            theme="dark"
            className="bg-none border-0"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">
              <Link to="/market">Market</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/wallet">Wallet</Link>
            </Menu.Item>
          </Menu>
        </div>  
        <div className="col-auto">
            <Menu
              theme="dark"
              className="bg-none border-0"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="3">Setting</Menu.Item>
              <Menu.Item key="4">English</Menu.Item>
            </Menu>
        </div>
      </div>
    </div>
    
    
  )
}