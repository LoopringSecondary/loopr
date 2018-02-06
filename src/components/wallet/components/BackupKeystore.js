import React from 'react';
import {Form} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"

class BackupKeystore extends React.Component {

  state = {
    fileName: null,
    blob: null
  };

  componentWillMount() {
    const {account} = this.props;
    const password = account['password'];
    const privateKey = account['privateKey'];
    const file = download(privateKey, password);
    this.setState({...file})
  }

  render() {
    const {fileName, blob} = this.state;
    return (
      <div>
        <div className="text-center">
          <img src={icon} className="mt25 mb25" style={{width: '100px'}}/>
          <div className="fs20 color-grey-900 mb5">Dont Lose It!</div>
          <div className="fs14 color-grey-600 mb15">It cannot be recovered if you lose it.</div>
          <div className="fs20 color-grey-900 mb5">Do not share it!!</div>
          <div className="fs14 color-grey-600 mb15">Your funds will be stolen if you use this file on a
            malicious/phishing
            site.
          </div>
          <div className="fs20 color-grey-900 mb5">Make a backup!!!</div>
          <div className="fs14 color-grey-600 mb15">Secure it like the millions of dollars it may one day be worth.
          </div>
        </div>
        <a href={blob}
           download={fileName}
           className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt25 align-items-center">I
          Understand, Download Wallet File</a>
      </div>
    )
  }
}


export default Form.create()(BackupKeystore)
