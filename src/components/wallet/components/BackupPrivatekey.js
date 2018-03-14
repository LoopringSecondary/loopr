import React from 'react';
import {Button, Form, Input, message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import copy from 'copy-to-clipboard';

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
    const {account} = this.props;
    const {visible} = this.state;
    const backup = () => {
      const wallet = account['privateKey'];
      copy(wallet) ? message.success('Copy to clipboard') : message.error('Copy failed')
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
        <Input
          type={visible ? 'text' : 'password'}
          value={window.WALLET.getPrivateKey()}
          size="large"
          addonAfter={visibleIcon}
          readOnly
        />
        <Button className="d-block w-100 mt25" size="large" type="primary" onClick={backup}>I Understand, Copy Private
          Key</Button>
      </div>
    )
  }
}

export default Form.create()(BackupPrivatekey)
