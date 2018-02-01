import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon,Modal } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'
import icon from '../../../assets/images/icon-backup-wallet.png'

function BackupWallet({form}) {



  return (
    <Card title="Backup Wallet">
      <div className="text-center">
        <img src={icon} className="mt25 mb25" style={{width:'100px'}}/>
        <div className="fs20 color-grey-900 mb5">Dont Lose It!</div>
        <div className="fs14 color-grey-600 mb15">It cannot be recovered if you lose it.</div>
        <div className="fs20 color-grey-900 mb5">Do not share it!!</div>
        <div className="fs14 color-grey-600 mb15">Your funds will be stolen if you use this file on a malicious/phishing site.</div>
        <div className="fs20 color-grey-900 mb5">Make a backup!!!</div>
        <div className="fs14 color-grey-600 mb15">Secure it like the millions of dollars it may one day be worth.</div>
      </div>
      <Button className="d-block w-100 mt25" size="large" type="primary">I Understand, Download Wallet File </Button>
    </Card>
  )
}
export default Form.create()(BackupWallet)
