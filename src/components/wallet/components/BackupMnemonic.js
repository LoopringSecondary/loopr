import React from 'react';
import {Button, Form, Input, Alert} from 'antd';
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
        <div className="text-left">
          <img hidden src={icon} className="mt25 mb25" style={{width: '100px'}}/>
          <Alert
            description={intl.get('wallet.backup.backup_tip')}
            type="error"
            iconType="exclamation-circle"
            showIcon
            className="mb15 mt15"
          />
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
