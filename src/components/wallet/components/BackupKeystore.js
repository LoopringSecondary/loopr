import React from 'react';
import {Button, Form} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {encrypt} from "Loopring/ethereum/account"
import {addHexPrefix, clearPrefix, toBuffer} from "Loopring/common/formatter"

function BackupKeystore({account}) {

  const download = () =>{
    //TODO 通过state 获取account
    const password = account['password'];
    console.log(password);
    const wallet = account['privateKey'];
    const element = document.createElement('a');
    console.log(wallet);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(encrypt(toBuffer(addHexPrefix(account['privateKey'])),password))));
    const ts = new Date();
    element.setAttribute('download', ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', clearPrefix(account.address), '.json'].join(''));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <div>
      <div className="text-center">
        <img src={icon} className="mt25 mb25" style={{width: '100px'}}/>
        <div className="fs20 color-grey-900 mb5">Dont Lose It!</div>
        <div className="fs14 color-grey-600 mb15">It cannot be recovered if you lose it.</div>
        <div className="fs20 color-grey-900 mb5">Do not share it!!</div>
        <div className="fs14 color-grey-600 mb15">Your funds will be stolen if you use this file on a malicious/phishing
          site.
        </div>
        <div className="fs20 color-grey-900 mb5">Make a backup!!!</div>
        <div className="fs14 color-grey-600 mb15">Secure it like the millions of dollars it may one day be worth.</div>
      </div>
      <Button className="d-block w-100 mt25" size="large" type="primary" onClick={download}>I Understand, Download Wallet File </Button>
    </div>
  )
}

export default Form.create()(BackupKeystore)
