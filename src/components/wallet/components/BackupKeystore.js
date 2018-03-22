import React from 'react';
import {Form} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"
import intl from 'react-intl-universal';

class BackupKeystore extends React.Component {

  state = {
    fileName: null,
    blob: null
  };

  componentDidMount() {
    const file = window.WALLET.download();
    this.setState({...file})
  }

  render() {
    const {fileName, blob} = this.state;
    return (
      <div>
        <div className="text-center">
          <img src={icon} className="mt25 mb25" style={{width: '100px'}}/>
          <div className="fs20 color-grey-900 mb5">{intl.get('wallet.backup.not_lose')}!</div>
          <div className="fs14 color-grey-600 mb15">{intl.get('wallet.backup.not_recover')}.</div>
          <div className="fs20 color-grey-900 mb5">{intl.get('wallet.backup.not_share')}!!</div>
          <div className="fs14 color-grey-600 mb15">{intl.get('wallet.backup.stolen')}.
          </div>
          <div className="fs20 color-grey-900 mb5">{intl.get('wallet.backup.backup')}!!!</div>
          <div className="fs14 color-grey-600 mb15">{intl.get('wallet.backup.secure')}.
          </div>
        </div>
        <a href={blob}
           download={fileName}
           className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt25 align-items-center">
          {intl.get('wallet.backup.download')}</a>
      </div>
    )
  }
}


export default Form.create()(BackupKeystore)
