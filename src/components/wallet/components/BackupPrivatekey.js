import React from 'react';
import {Button, Form, Input, Alert} from 'antd';
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
        <Input
          type={visible ? 'text' : 'password'}
          value={window.WALLET.getPrivateKey()}
          size="large"
          addonAfter={visibleIcon}
          readOnly
        />
        <Button className="d-block w-100 mt25" size="large" type="primary" onClick={backup}>{intl.get('wallet.backup.copy_privatekey')}</Button>
      </div>
    )
  }
}

export default Form.create()(BackupPrivatekey)
