import React from 'react';
import {Form,Button,Popconfirm,Alert,Input} from 'antd';
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
    const gotoWallet = ()=>{
      this.props.modal.hideThisModal()
      window.routeActions.gotoPath('/wallet')
    }
    return (
      <div>
        <div className="text-left">
          <Alert
            description={intl.get('wallet.backup.backup_tip')}
            type="error"
            iconType="exclamation-circle"
            showIcon
            className="mb15"
          />
        </div>
        <Input.TextArea
          value={window.WALLET.getMnemonic()}
          autosize={{minRows: 3, maxRows: 6}}
          size="large"
        />
        <Button className="d-block w-100 mt15" size="large" type="primary" onClick={backup}>{intl.get('wallet.backup.copy_mnemonic')}</Button>
        <Popconfirm title={intl.get('wallet.backup.confirm_to_leave_backup_page')} overlayClassName="origin" onConfirm={gotoWallet} okText={intl.get('global.yes')} cancelText={intl.get('global.no')}>
            <Button type="default" size="large" className="d-block w-100 mt10">
            {intl.get('wallet.backup.leave_backup_page')}
            </Button>
        </Popconfirm>
      </div>
    )
  }
}
export default Form.create()(BackupMnemonic)
