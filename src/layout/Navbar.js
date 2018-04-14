import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Button, Icon, Menu, message, Popover, Select,Badge,Row} from 'antd';
import {Link} from 'dva/router';
import copy from 'copy-to-clipboard';
import TopNotification from './TopNotification';
import {locales} from '../common/config/data'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

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
  const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address'

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
      copy(account.address) ? Notification.open({ message:intl.get('navbar.subs.copy_success'),
        type:'success',size:'small'}) :  Notification.open({message:intl.get('navbar.subs.copy_failed'),type:"error",size:'small'})

    }else{
      message.warning(intl.get('navbar.subs.copy'))
    }
  }
  const accountMenus = (
    <div className="fs18" style={{maxWidth:'280px'}}>
      {
        account.isUnlocked &&
        <div>
          <div className="zb-b-b fs14 p10 pl15 pr15">
            <div className="row align-items-center">
              <div className="col">
                <div className="fs14 color-black-2 text-wrap" style={{maxWidth:'180px'}}>{account.address}</div>
              </div>
              <div className="col-auto pr10">
                <Button className="fs14" type="primary" size="small" onClick={copyToClipboard}>{intl.get('navbar.subs.copy')}</Button>
              </div>
            </div>
          </div>
          <div className="row ml0 mr0 zb-b-b navbar-account-grids bg-grey-50">
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="fs14 color-black-2 navbar-account-grid">
                <a onClick={showModal.bind(this,{id:'token/receive',symbol:null})}>
                  <i className="grid-icon icon-loopring icon-loopring-receive fs16 color-black-2 d-block"></i>
                  <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.receive')}</div>
                </a>
              </div>
            </div>

            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              {!isWatchOnly &&
                <div className="fs14 color-black-2 navbar-account-grid">
                    <a onClick={showModal.bind(this,{id:'token/transfer', item:''})}>
                      <i className="grid-icon icon-loopring icon-loopring-transfer fs16 color-black-2 d-block"></i>
                      <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.send')}</div>
                    </a>
                </div>
              }
              {isWatchOnly &&
                <div className="fs14 color-black-2 navbar-account-grid cursor-not-allowed">
                  <i className="grid-icon icon-loopring icon-loopring-transfer fs16 color-black-2 d-block"></i>
                  <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.send')}</div>
                </div>
              }

            </div>
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="fs14 color-black-2 navbar-account-grid">
                <Link to="/trade" className='color-black-2'>
                  <i className="grid-icon icon-loopring icon-loopring-trade fs16 color-black-2 d-block"></i>
                  <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.trade')}</div>
                </Link>
              </div>
            </div>
            {
              (account.walletType === 'KeyStore'|| account.walletType === 'Mnemonic' || account.walletType === 'PrivateKey') &&
              <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
                  <div className="fs14 color-black-2 navbar-account-grid">
                    <a onClick={showModal.bind(this,{id:'wallet/export/keystore'})}>
                      <Icon type="export" className="d-block grid-icon" />
                      <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.export')}</div>
                    </a>
                  </div>
              </div>
            }
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="pointer fs14 color-black-2 navbar-account-grid" onClick={showModal.bind(this,{id:'settings'})}>
                <Icon type="setting" className="d-block grid-icon" />
                <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.settings')}</div>
              </div>
            </div>
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
                <div className="fs14 color-black-2 text-right navbar-account-grid">
                    <a onClick={showModal.bind(this, {id: 'wallet/airdrop'})} className="color-black-2 d-block text-center">
                        <div className="grid-title">
                          <Icon type="gift" className="grid-icon"/>
                        </div>
                        <div className="grid-title text-truncate text-nowrap">🔥{intl.get('navbar.subs.airdrop')}</div>
                    </a>
                </div>
            </div>
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="fs14 color-black-2 navbar-account-grid cursor-not-allowed">
                <Icon type="tool" className="d-block grid-icon " />
                <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.tools')}</div>
              </div>
            </div>
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="fs14 color-black-2 navbar-account-grid cursor-not-allowed">
                <Icon type="question-circle-o" className="d-block grid-icon" />
                <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.help')}</div>
              </div>
            </div>
            <div className="col-sm-4 text-center pl0 pr0 zb-b-b">
              <div className="fs14 color-black-2 navbar-account-grid cursor-not-allowed">
                <Icon type="form" className="d-block grid-icon" />
                <div className="grid-title text-truncate text-nowrap">{intl.get('navbar.subs.feedback')}</div>
              </div>
            </div>

          </div>
          <div className="zb-b-t bg-grey-50 fs14 p10 pl15 pr15" style={{borderRadius:'0 0 4px 4px'}}>
            <div className="row align-items-center ">
              <div className="col">
                <span className="navbar-login-status-badge color-primary-1">
                  <Badge status="processing" className="" />
                  {intl.get("wallet.unlocked_by", {type:window.WALLET_UNLOCK_TYPE})}
                </span>
              </div>
              <div className="col-auto pr10">
                <Button className="border-none color-primary-1 fs1" title={intl.get('navbar.subs.quit')} type="ghost" size="small" icon="lock" onClick={quit}></Button>
              </div>
            </div>
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
          <div className="pointer zb-b-b fs14 color-grey-900 p10 pl15 pr15" onClick={showModal.bind(this,{id:'settings'})}>
            <Icon type="setting" className="mr5" />{intl.get('navbar.settings')}
          </div>

          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15 cursor-not-allowed">
            <Icon type="question-circle-o" className="mr5" />{intl.get('navbar.subs.help')}
          </div>
          <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15 cursor-not-allowed">
            <Icon type="tool" className="mr5" />{intl.get('navbar.subs.tools')}
          </div>
        </div>
      }
    </div>
  )
  const VersionTip = (
    <div className="" style={{maxWidth:'280px'}}>
      <div className="p15">
        <div className="fs16 color-primary-1">{intl.get('version.title')}</div>
        <div className="fs12 color-black-1 mt5">{intl.get('version.description')}</div>
      </div>
      <div className="zb-b-t">
        <div className="row pl10 pr10" style={{padding:'7px 0px'}}>
          <div className="col fs12 color-black-2">{intl.get('version.version')}</div>
          <div className="col-auto fs12 color-black-3">2.0 Trial</div>
        </div>
      </div>
      <div className="zb-b-t">
        <div className="row pl10 pr10" style={{padding:'7px 0px'}}>
          <div className="col fs12 color-black-2">{intl.get('version.update_time')}</div>
          <div className="col-auto fs12 color-black-3">{window.uiFormatter.getFormatTime(moment().format('x'),'YYYYMMDD')}</div>
        </div>
      </div>
      <div className="zb-b-t">
        <div className="row pl10 pr10" style={{padding:'7px 0px'}}>
          <div className="col fs12 color-black-2">{intl.get('version.feedback')}</div>
          <div className="col-auto fs12 color-black-3 cursor-not-allowed">
            {intl.get('version.feedback_submit')}
            <Icon type="right" />
          </div>
        </div>
      </div>
      <div className="zb-b-t">
        <div className="row pl10 pr10" style={{padding:'7px 0px'}}>
          <div className="col fs12 color-black-2">{intl.get('version.roadmap_label')}</div>
          <div className="col-auto fs12 color-black-3 cursor-not-allowed">
            {intl.get('version.roadmap_title')}
            <Icon type="right" />
          </div>
        </div>
      </div>

    </div>
  )
  return (
    <div className="navbar-loopring">
      <div className="container">
        <div className="row align-items-stretch ml0">
          <div className="col-auto pl0 pr0">
            <Link to="/" className="d-block" >
                <i className="icon-loopring icon-loopring-logo d-block" style={{fontSize:'36px',marginTop:'-3px'}}  />
            </Link>
          </div>
          <div className="col-auto pl10 pr0">
            <Popover content={VersionTip} title={null} trigger="hover">
              <span className="navbar-version-badge">
                <Badge status="processing" className="" />
                {intl.get('version.label')}
              </span>
            </Popover>
          </div>
          <div className="col"></div>
          <div className="col-auto">
            <Menu
              theme="light"
              className="bg-none border-0"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
              selectedKeys={selectedKeys}
            >
              {
                window.WALLET && window.WALLET.getAddress() &&
                <Menu.Item key="/wallet">
                  <Link className="fs16" to="/wallet">{intl.get('navbar.wallet')}</Link>
                </Menu.Item>
              }
              {
                window.WALLET && window.WALLET.getAddress() &&
                <Menu.Item key="/trade">
                  <Link to="/trade" className="fs16">{intl.get('navbar.trade')}</Link>
                </Menu.Item>
              }
            </Menu>
          </div>
          <div className="col"></div>
          <div className="col-auto">
            <Select value={props.locales.locale} onChange={localeChange} className="navbar-language mr5 fs16">
              {localesOptions}
            </Select>
            <Popover content={accountMenus} title={null} trigger="hover">
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
