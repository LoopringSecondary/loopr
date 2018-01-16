import React from 'react';
import {Menu} from 'antd';
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
          <a href="/" className="d-block h-100" >
            <span className="color-white fs28">Ringinfo</span>
          </a>
        </div>
        <div className="col-auto" hidden>
          <div className="color-grey-400 fs16">
            A Looring Ring Explorer
          </div>
        </div>
        <div className="col">
        </div>
        <div className="col-auto">
          {
            false &&
            <Menu
              theme="dark"
              className="bg-grey-900"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Market</Menu.Item>
              <Menu.Item key="2">Wallet</Menu.Item>
              <Menu.Item key="3">Loopring</Menu.Item>
              <Menu.Item key="4">ENG</Menu.Item>
            </Menu>
          }
        </div>
      </div>
    </div>
    
    
  )
}