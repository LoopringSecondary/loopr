import React from 'react';
import {Button, Form, Input, message} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import copy from 'copy-to-clipboard';

class BackupMnemonic extends React.Component {

  togglePassword(){
    this.setState({
      visible: !this.state.visible
    })
  }
  render(){
    const backup = () => {
      copy(window.WALLET.getMnemonic()) ? message.success('Copy to clipboard') : message.error('Copy failed')
    };

    return (
      <div>
        <div className="text-center">
          <img src={icon} className="mt25 mb25" style={{width: '100px'}}/>
          <div className="fs20 color-grey-900 mb5">Dont Lose It!</div>
          <div className="fs14 color-grey-600 mb15">It cannot be recovered if you lose it.</div>
          <div className="fs20 color-grey-900 mb5">Do not share it!!</div>
          <div className="fs14 color-grey-600 mb15">Your funds will be stolen if you use this file on a malicious/phishing
            site.
          </div>
          <div className="fs20 color-grey-900 mb5">Make a backup!!!</div>
          <div className="fs14 color-grey-600 mb15">Secure it like the millions of dollars it may one day be worth.</div>
        </div>
        <Input.TextArea
          value={window.WALLET.getMnemonic()}
          autosize={{minRows: 3, maxRows: 6}}
          size="large"
        />
        <Button className="d-block w-100 mt25" size="large" type="primary" onClick={backup}>I Understand, Copy Mnemonic</Button>
      </div>
    )
  }
}
export default Form.create()(BackupMnemonic)
