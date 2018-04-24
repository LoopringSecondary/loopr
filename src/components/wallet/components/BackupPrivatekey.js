import React from 'react';
import {Button, Form, Input, Alert,Popconfirm} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

class BackupPrivatekey extends React.Component {

  state = {
    visible: false,
    disabled: true,
  };

  togglePassword() {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    const {visible} = this.state;
    const backup = () => {
      copy(window.WALLET.getPrivateKey()) ?
        Notification.open({type: 'success', size: 'small', message: intl.get('token.copy_success')}) :
        Notification.open({message: intl.get('token.copy_failed'), type: "error", size: 'small'})
    };
    const gotoWallet = ()=>{
      this.props.modal.hideThisModal()
      window.routeActions.gotoPath('/wallet')
    }
    const visibleIcon = (
      <div className="fs14 pl5 pr5">
        {visible &&
        <i className="fa fa-eye" onClick={this.togglePassword.bind(this)}/>
        }
        {!visible &&
        <i className="fa fa-eye-slash" onClick={this.togglePassword.bind(this)}/>
        }
      </div>
    );
    return (
      <div>
        <div className="text-left">
          <Alert
            //  message={intl.get('wallet.backup.not_lose') + " !"}
            description={intl.get('wallet.backup.backup_tip')}
            type="error"
            iconType="exclamation-circle"
            showIcon
            className="mb15"
          />
        </div>
        <Input
          type={visible ? 'text' : 'password'}
          value={window.WALLET.getPrivateKey()}
          size="large"
          className="fs12"
          addonAfter={visibleIcon}
          readOnly
        />
        <Button className="d-block w-100 mt15" size="large" type="primary" onClick={backup}>{intl.get('wallet.backup.copy_privatekey')}</Button>
        <Popconfirm title={intl.get('wallet.backup.confirm_to_leave_backup_page')} overlayClassName="origin" onConfirm={gotoWallet} okText={intl.get('global.yes')} cancelText={intl.get('global.no')}>
            <Button type="default" size="large" className="d-block w-100 mt10">
            {intl.get('wallet.backup.leave_backup_page')}
            </Button>
        </Popconfirm>
      </div>
    )
  }
}

export default Form.create()(BackupPrivatekey)
