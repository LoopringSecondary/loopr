import React from 'react';
import {connect} from 'dva';
import {Menu,Select,Popover,Button,Icon,message,Alert} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo-blue@2x.png'
import copy from 'copy-to-clipboard';
import TopNotification from './TopNotification';
import {locales} from '../common/config/data'
import intl from 'react-intl-universal';

function Navbar(props){
  let selectedKeys = []
  if(props.location && props.match){
    let route = props.match.path
    let url = props.location.pathname
    if(url.indexOf(route)>-1){
      selectedKeys.push(props.location.pathname)
    }
  }
  if(props.match){

  }
  const account = props.account;

  const localeChange = (value)=>{
    props.dispatch({
      type:'locales/setLocale',
      payload:{
        locale:value
      }
    });
    let currency = value === 'en' ? 'USD' : 'CNY'
    props.dispatch({
      type:'settings/preferenceChange',
      payload:{
        language: value,
        currency: currency,
      }
    })
  }
  const showModal = (id)=>{
    props.dispatch({
      type:'modals/modalChange',
      payload:{
        id,
        visible:true
      }
    })
  }

  const quit = ()=>{
    props.dispatch({
      type:'account/deleteAccount',
      payload:{}
    })
  };

  const localesOptions = locales.map(locale => <Select.Option value={locale.value} key={locale.value}>{locale.name}</Select.Option>);


  function copyToClipboard() {

    if(account.isUnlocked ){
      copy(account.address) ? message.success(intl.get('navbar.account.copy.success')) :  message.error(intl.get('navbar.account.copy.failed'))
    }else{
      message.warning(intl.get('navbar.account.copy.title'))
    }
  }

  const getAccount = ()=>{
    if(account.address){
      return window.uiFormatter.getShortAddress(account.address)
    }else{
      return intl.get('navbar.account.title')
    }
  }

  const accountMenus = (
    <div className="fs18">
      {
        account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col">
                <div className="fs16 color-grey-900">{intl.get('navbar.account.address')}</div>
                <div className="fs12 color-grey-500 text-wrap" style={{maxWidth:'180px'}}>{account.address}</div>
              </div>
              <div className="col-auto">
                <Button className="fs12" type="primary" size="small" onClick={copyToClipboard}>{intl.get('navbar.account.copy.title')}</Button>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'token/receive')}>
              <Icon type="qrcode" className="mr5" />{intl.get('navbar.account.qrcode')}
            </a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Link to="/wallet/airdrop" className="color-grey-900">
              <Icon type="gift" className="mr5" />{intl.get('navbar.account.airdrop')}
            </Link>
          </div>
          {(account.walletType === 'KeyStore'|| account.walletType === 'Mnemonic' || account.walletType === 'PrivateKey') &&  <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'wallet/export/keystore')}>
              <Icon type="export" className="mr5" />{intl.get('navbar.account.export')}
            </a>
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />{intl.get('navbar.account.help')}
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="tool" className="mr5" />{intl.get('navbar.account.tools')}
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={quit}><Icon type="poweroff" className="mr5" />{intl.get('navbar.account.quit')}
            </a>
          </div>
        </div>
      }
      {!account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col-auto">
                <a  onClick={showModal.bind(this,'wallet/unlock')} className="color-grey-900">
                <Icon type="unlock" className="mr5" />{intl.get('navbar.account.unlock')}
                </a>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,'wallet/generate')} className="color-grey-900">
              <Icon type="plus" className="mr5" />{intl.get('navbar.account.generate')}
            </a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />{intl.get('navbar.account.help')}
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="tool" className="mr5" />{intl.get('navbar.account.tools')}
          </div>
        </div>
      }
    </div>
  )

  return (
    <div className="">
      {
        false &&
        <TopNotification />
      }

      <div className="container">
        <div className="row align-items-stretch justify-content-between ml0">
          <div className="col-auto pl0 pr0">
            <a href="/" className="d-block" >
              <img src={logo} alt="" style={{height:'38px'}} />
            </a>
          </div>
          <div className="col-auto">
            <Menu
              theme="light"
              className="bg-none border-0"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
              selectedKeys={selectedKeys}
            >
              <Menu.Item key="/home" ><Link className="fs16" to="/home">{intl.get("navbar.home")}</Link></Menu.Item>
              <Menu.Item key="/trade">
                <Link to="/trade" className="fs16">{intl.get('navbar.trade')}</Link>
              </Menu.Item>
              {
                window.WALLET && window.WALLET.getAddress() &&
                <Menu.Item key="/wallet/portfolio" >
                  <Link className="fs16" to="/wallet/portfolio">{intl.get("navbar.portfolio")}</Link>
                </Menu.Item>
              }
              {
                (!window.WALLET || !window.WALLET.getAddress()) &&
                <Menu.Item key="/wallet" >
                  <a className="fs16" onClick={showModal.bind(this,'wallet/unlock')}>{intl.get('navbar.wallet')}</a>
                </Menu.Item>
              }
              {
                window.WALLET && window.WALLET.getAddress() &&
                <Menu.Item key="/wallet">
                  <Link className="fs16" to="/wallet">{intl.get('navbar.wallet')}</Link>
                </Menu.Item>
              }

            </Menu>
          </div>
          <div className="col-auto">
            <span className="fs16 mr10 color-grey-600 cursor-pointer" onClick={showModal.bind(this,'settings')}>{intl.get('navbar.setting')}</span>
            <Select value={props.locales.locale || 'en-US'} onChange={localeChange} className="navbar-language mr5 fs16">
              {localesOptions}
            </Select>
            <Popover content={accountMenus} title={null}>
                <a className="fs16">{getAccount()} <Icon type="down" className="color-grey-400 fs12" /></a>
            </Popover>
          </div>
        </div>
      </div>

    </div>
  )
}

export default connect(({locales,account})=>({locales,account}))(Navbar)
