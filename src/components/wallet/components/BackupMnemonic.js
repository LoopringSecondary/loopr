import React from 'react';
import {Button, Form, Input, message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

class BackupMnemonic extends React.Component {

  render(){
    const backup = () => {
      copy(window.WALLET.getMnemonic()) ?
        Notification.open({type: 'success', size: 'small', message: intl.get('token.copy_success')}) :
        Notification.open({message: intl.get('token.copy_failed'), type: "error", size: 'small'})
    };

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
          <div className="fs14 color-grey-600 mb15">{intl.get('wallet.backup.secure')}.</div>
        </div>
        <Input.TextArea
          value={window.WALLET.getMnemonic()}
          autosize={{minRows: 3, maxRows: 6}}
          size="large"
        />
        <Button className="d-block w-100 mt25" size="large" type="primary" onClick={backup}>{intl.get('wallet.backup.copy_mnemonic')}</Button>
      </div>
    )
  }
}
export default Form.create()(BackupMnemonic)
