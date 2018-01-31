import React from 'react';
import { Button,Icon,Card,Modal,Input,Radio,Select,Checkbox,message} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
const Search = Input.Search;

let Receive = (props) => {

  function copyToClipboard(value) {
    copy(value) ? message.success('Copy Successfully') :  message.error("Copy Failed")
  }
  return (
    <Card title="My Ethereum Address">
      <div style={{textAlign:'center'}}>
        <div style={{padding:"30px 20px"}}>
        <QRCode value="0xe0cC17fe6B36Fd310cb1f98048f6c42b43Cfde45" size={240}/>
        </div>
        <Search enterButton="Copy" value="0xe0cC17fe6B36Fd310cb1f98048f6c42b43Cfde45" disabled onSearch={copyToClipboard}/>
      </div>
    </Card>
   
  );
};

export default Receive;


