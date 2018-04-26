import React from 'react';
import {Button, Card, Input, Progress} from 'antd';
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

export default class GenerateWallet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      strength: '',
      disabled: true,
      value: ''
    }
  }

  togglePassword() {
    this.setState({
      visible: !this.state.visible
    })
  }

  passwordChange(e) {
    const value = e.target.value
    const strength = this.getStrength(value)
    const disabled = value.length <= 6;
    this.setState({
      value,
      strength,
      disabled
    })
  }

  getStrength(value) {
    if (value.length <= 6) {
      return 'weak'
    }
    if (value.length > 10) {
      return 'strong'
    }
    if (6 < value.length <= 10) {
      return 'average'
    }
  }

  handelSubmit() {
    const {modal, account} = this.props;
    modal.showLoading({id: 'wallet/generate'});
    account.createWallet({password: this.state.value});
    modal.hideLoading({id: 'wallet/generate'});
    modal.hideModal({id: 'wallet/generate'});
    modal.showModal({id: 'wallet/backup'});
    this.setState({
      visible: false,
      strength: '',
      disabled: true,
      value: ''
    });
    Notification.open({
      message:intl.get('wallet.unlocked_notification_title'),
      description:intl.get('wallet.unlocked_notification_content'),
      type:'success'
    })
  }

  gotoUnlock() {
    const {modal} = this.props
    modal.hideModal({id: 'wallet/generate'})
    modal.showModal({id: 'wallet/unlock',targetModalData: {}})
  }

  render() {
    const {visible, strength, disabled, value} = this.state;
    const {modal} = this.props;
    const loading = modal['loading'];

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
      <Card title={intl.get('wallet.generate_wallet')}>
        <Input
          type={visible ? 'text' : 'password'}
          value={value}
          size="large"
          placeholder={intl.get('wallet.set_password')}
          addonAfter={visibleIcon}
          onChange={this.passwordChange.bind(this)}
        />
        {
          value &&
          <div className="row pt10 pb10">
            <div className="col-auto pr0">
              <span className="fs12 color-grey-900">{intl.get('wallet.password_strength')}</span>
            </div>
            <div className="col-5">
              {strength === 'weak' &&
              <Progress className="d-inline-block" percent={30} strokeWidth={4} status="exception"
                        format={() => intl.get(`wallet.${strength}`)}/>
              }
              {strength === 'average' &&
              <Progress className="d-inline-block" percent={60} strokeWidth={4} status="active"
                        format={() => intl.get(`wallet.${strength}`)}/>
              }
              {strength === 'strong' &&
              <Progress className="d-inline-block" percent={90} strokeWidth={4} status="success"
                        format={() => intl.get(`wallet.${strength}`)}/>
              }
            </div>
          </div>
        }
        <div className="mb25"></div>
        <Button disabled={disabled} loading={loading} onClick={this.handelSubmit.bind(this)}
                className="w-100 d-block mt15" type="primary" size="large">
          {intl.get('wallet.generate')}
        </Button>
        <div className="fs14 color-grey-900 text-center pt20 zb-b-t mt20">
          {intl.get('wallet.have_one')} ?
          <a className="color-blue-600 ml5" onClick={this.gotoUnlock.bind(this)}>
            {intl.get('wallet.to_unlock')} !
          </a>
        </div>
      </Card>
    );
  }
}

