import React from 'react';
import {Card, Input, message} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

const Search = Input.Search;

let Receive = (props) => {
  const address = window.WALLET.getAddress();
  if(!address){
    return (
      <Card title="Address is Null">
        Please Confirm your wallet is unlock.
      </Card>
    )
  }
  function copyToClipboard(value) {
    copy(value) ? message.success('Copy Successfully') :  message.error("Copy Failed")
  }
  return (
    <Card title="My Ethereum Address">
      <div style={{textAlign:'center'}}>
        <div style={{padding:"30px 20px"}}>
        <QRCode value={address} size={240}/>
        </div>
        <Search enterButton="Copy" value={address} disabled onSearch={copyToClipboard}/>
      </div>
    </Card>

  );
};

export default Receive;


