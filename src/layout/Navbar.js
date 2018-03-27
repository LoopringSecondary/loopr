import React from 'react';
import {connect} from 'dva';
import {Menu,Select,Popover,Button,Icon,message,Alert} from 'antd';
import {Link} from 'dva/router';
import logo from '../assets/images/logo-new.png'
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
      selectedKeys.push(route)
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
    let currency = value.startsWith('en' ) ? 'USD' : 'CNY'
    props.dispatch({
      type:'settings/preferenceChange',
      payload:{
        language: value,
        currency: currency,
      }
    })
  }
  const showModal = (payload)=>{
    props.dispatch({
      type:'modals/modalChange',
      payload:{
        ...payload,
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

  const localesOptions = locales.map(locale => <Select.Option className="fs16" value={locale.value} key={locale.value}><span className="fs16">{locale.name}</span></Select.Option>);
  function copyToClipboard() {

    if(account.isUnlocked ){
      copy(account.address) ? message.success(intl.get('navbar.subs.copy_success')) :  message.error(intl.get('navbar.subs.copy_failed'))
    }else{
      message.warning(intl.get('navbar.subs.copy'))
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
                <div className="fs14 color-black-1 text-wrap" style={{maxWidth:'180px'}}>{account.address}</div>
              </div>
              <div className="col-auto">
                <Button className="fs14" type="primary" size="small" onClick={copyToClipboard}>{intl.get('navbar.subs.copy')}</Button>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,{id:'token/receive'})}>
              <i className="icon-loopring icon-loopring-receive fs16 color-grey-900 mr5"></i>{intl.get('navbar.subs.receive')}
            </a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,{id:'token/transfer', item:''})}>
              <i className="icon-loopring icon-loopring-transfer fs16 color-grey-900 mr5"></i>{intl.get('navbar.subs.send')}
            </a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Link to="/trade" className='color-grey-900'>
              <i className="icon-loopring icon-loopring-trade fs16 color-grey-900 mr5"></i>{intl.get('navbar.subs.trade')}
            </Link>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,{id:'wallet/airdrop'})} className="color-grey-900">
              <Icon type="gift" className="mr5" />{intl.get('navbar.subs.airdrop')}
            </a>
          </div>
          {(account.walletType === 'KeyStore'|| account.walletType === 'Mnemonic' || account.walletType === 'PrivateKey') &&  <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,{id:'wallet/export/keystore'})}>
              <Icon type="export" className="mr5" />{intl.get('navbar.subs.export')}
            </a>
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />{intl.get('navbar.subs.help')}
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="tool" className="mr5" />{intl.get('navbar.subs.tools')}
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={quit}><Icon type="poweroff" className="mr5" />{intl.get('navbar.subs.quit')}
            </a>
          </div>
        </div>
      }
      {!account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col-auto">
                <a  onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'Portfolio'})} className="color-grey-900">
                <Icon type="unlock" className="mr5" />{intl.get('navbar.subs.unlock')}
                </a>
              </div>
            </div>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <a onClick={showModal.bind(this,{id:'wallet/generate'})} className="color-grey-900">
              <Icon type="plus" className="mr5" />{intl.get('navbar.subs.generate')}
            </a>
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="question-circle-o" className="mr5" />{intl.get('navbar.subs.help')}
          </div>
          {false && <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            Switch Wallet
          </div>}
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
            <Icon type="tool" className="mr5" />{intl.get('navbar.subs.tools')}
          </div>
        </div>
      }
    </div>
  )

  return (
    <div className="navbar-loopring">
      {
        false &&
        <TopNotification />
      }

      <div className="container">
        <div className="row align-items-stretch justify-content-between ml0">
          <div className="col-auto pl0 pr0">
            <Link to="/" className="d-block" >
              <img src={logo} alt="" style={{height:'38px',top:'-3px',position:'relative'}} />
            </Link>
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
              {
                (!window.WALLET || !window.WALLET.getAddress()) &&
                <Menu.Item key="/wallet" >
                  <a className="fs16" onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'Wallet'})}>{intl.get('navbar.wallet')}</a>
                </Menu.Item>
              }
              {
                window.WALLET && window.WALLET.getAddress() &&
                <Menu.Item key="/wallet">
                  <Link className="fs16" to="/wallet">{intl.get('navbar.wallet')}</Link>
                </Menu.Item>
              }
              <Menu.Item key="/trade">
                <Link to="/trade" className="fs16">{intl.get('navbar.trade')}</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="col-auto">
            <span className="fs16 mr10 color-grey-600 cursor-pointer" onClick={showModal.bind(this,{id:'settings'})}>{intl.get('navbar.settings')}</span>
            <Select value={props.locales.locale} onChange={localeChange} className="navbar-language mr5 fs16">
              {localesOptions}
            </Select>
            <Popover content={accountMenus} title={null}>
                {
                  account.address &&
                  <span className="fs16 color-blue-600">
                    {window.uiFormatter.getShortAddress(account.address)}
                    <Icon type="down" className="fs12 ml5" />
                  </span>
                }
                {
                  !account.address &&
                  <span className="fs16">
                    {intl.get('navbar.account')}
                    <Icon type="down" className="color-grey-400 fs12 ml5" />
                  </span>
                }
            </Popover>
          </div>
        </div>
      </div>

    </div>
  )
}

export default connect(({locales,account})=>({locales,account}))(Navbar)
