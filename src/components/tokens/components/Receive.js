import React from 'react';
import { Button,Icon,Card,Modal,Input,Radio,Select,Checkbox,message} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
const Search = Input.Search;

let Receive = (props) => {
  const modal = props.modal
  const address = window.STORAGE.wallet.getAddress()
  if(!address){
    Modal.error({
      title:'wallet address is null',
      onOk:()=>{},
    })
    return null
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


