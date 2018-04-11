import React from 'react';
import {Form,Alert} from 'antd';
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
        <div className="text-left">
          <img hidden src={icon} className="mt25 mb25" style={{width: '100px'}}/>
          <Alert
            //  message={intl.get('wallet.backup.not_lose') + " !"}
            description={intl.get('wallet.backup.backup_tip')}
            type="error"
            iconType="exclamation-circle"
            showIcon
            className="mb15 mt15"
          />
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
