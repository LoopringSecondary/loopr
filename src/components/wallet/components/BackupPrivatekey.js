import React from 'react';
import {Button, Form, Input, message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';

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
      copy(window.WALLET.getPrivateKey()) ? message.success(intl.get('token.copy_success')) : message.error(intl.get('token.copy_failed'))
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
