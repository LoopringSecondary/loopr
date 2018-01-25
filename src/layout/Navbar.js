import React from 'react';
import {connect} from 'dva';
import {FormattedMessage,injectIntl} from 'react-intl';
import {Menu,Select} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo@2x.png'
function Navbar(props){
  const localeChange = (value)=>{
    props.dispatch({
      type:'locales/localeChange',
      payload:{
        locale:value
      }
    })
  }
  const showSetting = ()=>{
    props.dispatch({
      type:'modals/modalChange',
      payload:{
        id:'setting',
        visible:true
      }
    })
  }
  return (
    <div className="">
      <div className="row pl15 pr15 align-items-stretch">
        <div className="col-auto pl0 pr0">
          <a href="/" className="d-block" >
            <img src="https://loopring.io/images/logo.svg" alt="" style={{height:'38px'}} />
          </a>
        </div>
        <div className="col">
          <Menu
            theme="dark"
            className="bg-none border-0"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="3" ><Link to="/portfolio"><FormattedMessage id='navbar.portfolio'/></Link></Menu.Item>
            <Menu.Item key="1">
              <Link to="/market"><FormattedMessage id='navbar.market' /></Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/wallet"><FormattedMessage id='navbar.wallet' /></Link>
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
              <Menu.Item key="3">
                <a onClick={showSetting}><FormattedMessage id='navbar.setting' /></a>
              </Menu.Item>
            </Menu>
        </div>
        <div className="col-auto">
          <Select defaultValue="en" onChange={localeChange}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="zh">中文</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default connect(({locales})=>({locales}))(Navbar)
