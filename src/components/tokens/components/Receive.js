import React from 'react';
import {Card, Input, message} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';

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
    copy(value) ? message.success(intl.get('token.copy_success')) :  message.error(intl.get('token.copy_failed'))
  }
  return (
    <Card title={intl.get('token.ethereum_address')}>
      <div style={{textAlign:'center'}}>
        <div style={{padding:"30px 20px"}}>
        <QRCode value={address} size={240}/>
        </div>
        <Search enterButton={intl.get('token.copy')} value={address} disabled onSearch={copyToClipboard}/>
      </div>
    </Card>

  );
};

export default Receive;


