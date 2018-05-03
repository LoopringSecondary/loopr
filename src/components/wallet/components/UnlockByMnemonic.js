import React from 'react';
import {Link} from 'dva/router';
import {Alert, Button, Form, Icon, Input, message, Select} from 'antd';
import {isValidateMnemonic} from "Loopring/common/mnemonic"
import {fromMnemonic} from 'Loopring/ethereum/account';
import MnemonicUnlockAccount from '../../../modules/account/MnemonicUnlockAccount'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

const Option = Select.Option;
const wallets = window.CONFIG.getWallets();

class UnlockByMnemonic extends React.Component {

  state = {
    mnemonic: null,
    isMnemonicValid: false,
    password: null,
    wallet: wallets[0],
    address: null
  };


  handleWalletType = (option) => {
    let {password, mnemonic, address} = this.state;
    const wallet = wallets[option];
    if (mnemonic && wallet && isValidateMnemonic(mnemonic) && (wallet.name === 'Loopring Wallet' && password || wallet.name !== 'Loopring Wallet')) {
      address = wallet.name === 'Loopring Wallet' ? this.decrypt(wallet.dpath, mnemonic, password) : this.decrypt(wallet.dpath, mnemonic)
    } else {
      address = null;
    }
    this.setState({wallet, address});
    this.props.form.setFieldsValue({address})
  };

  handlePathChange = (path, callback) => {
    const {mnemonic, password} = this.state;
    window.WALLET = new MnemonicUnlockAccount({mnemonic: mnemonic, dpath: path, password: password});
    callback();
  };

  handlePasswordChange = (e) => {
    let {mnemonic, wallet, address} = this.state;
    if (wallet && mnemonic && isValidateMnemonic(mnemonic)&& (wallet.name === 'Loopring Wallet' && e.target.value || wallet.name !== 'Loopring Wallet')) {
      address = wallet.name === 'Loopring Wallet' ? this.decrypt(wallet.dpath, mnemonic, e.target.value) : this.decrypt(wallet.dpath, mnemonic)
    } else {
      address = null;
    }
    this.setState({password: e.target.value, address});
    this.props.form.setFieldsValue({address})
  };

  handleMnemonicChange = (e) => {
    let {wallet, address,password} = this.state;
    if (wallet && e.target.value && isValidateMnemonic(e.target.value) && (wallet.name === 'Loopring Wallet' && password || wallet.name !== 'Loopring Wallet')) {
      address = wallet.name === 'Loopring Wallet' ? this.decrypt(wallet.dpath, e.target.value, password) : this.decrypt(wallet.dpath, e.target.value)
    } else {
      address = null;
    }
    this.setState({mnemonic: e.target.value, isMnemonicValid: isValidateMnemonic(e.target.value),address});
    this.props.form.setFieldsValue({address})
  };

  decrypt = (dpath, mnemonic, password) => {
    debugger;
    return fromMnemonic(mnemonic, `${dpath}/0`, password).address;
  };
  showAddresses = () => {
    const {pageFrom} = this.props;
    const {mnemonic, password} = this.state;
    const path = this.state.wallet.dpath;
    window.WALLET = new MnemonicUnlockAccount({mnemonic: mnemonic, dpath: path, password: password});
    window.WALLET_UNLOCK_TYPE = 'Mnemonic';
    this.props.modal.showModal({
      id: 'wallet/determineWallet',
      path,
      setWallet: this.setWallet,
      handlePathChange: this.handlePathChange,
      pageFrom: pageFrom
    })
  };

  bindShowAddress = (e) => {
    if (e.keyCode === 13) {
      try {
        e.preventDefault();
        const {form} = this.props;
        const mnemonic = form.getFieldValue('mnemonic');
        const password = form.getFieldValue('password');
        const {pageFrom} = this.props;
        if (isValidateMnemonic(mnemonic)) {
          const path = this.state.wallet.dpath;
          window.WALLET = new MnemonicUnlockAccount({mnemonic: mnemonic, dpath: path, password: password});
          window.WALLET_UNLOCK_TYPE = 'Mnemonic';
          this.props.modal.showModal({
            id: 'wallet/determineWallet',
            path,
            setWallet: this.setWallet,
            handlePathChange: this.handlePathChange,
            pageFrom: pageFrom
          })
        } else {
          message.error(intl.get('wallet.mnemonic_tip'))
        }
      } catch (e) {
        message.error(e.message)
      }

    }
  };

  setWallet = (index) => {
    const {account} = this.props;
    account.setMnemonic({...this.state, index});
    this.setState({
      mnemonic: null,
      isMnemonicValid: false,
      password: null,
    });
    Notification.open({
      message: intl.get('wallet.unlocked_notification_title'),
      description: intl.get('wallet.unlocked_notification_content'),
      type: 'success'
    })
  };


  render() {
    const {form} = this.props;
    const {wallet, address} = this.state;

    const options = wallets.map((wallet, index) => {
      return <Option key={index}>{wallet.name}</Option>
    });
    return (
      <div className="">
        <Alert
          message={<div className="color-red-600 fs18"><Icon
            type="exclamation-circle"/> {intl.get('wallet.not_recommended')}</div>}
          description={<div className="color-red-600">
            <div className="fs14">{intl.getHTML('wallet.instruction_mnemonic')}</div>
          </div>}
          type="error"
          showIcon={false}
          className="mb15"
        />
        <Form layout="horizontal" className="">
          <Form.Item className="mb15" label={intl.get('wallet.select_wallet')}>
            {form.getFieldDecorator('wallet', {
              initialValue: '0',
              rules: [{
                required: true,
                message: intl.get('wallet.select_wallet')
              }]
            })(
              <Select onChange={this.handleWalletType}>
                {options}
              </Select>
            )}
          </Form.Item>

          <Form.Item className="mb15" label={intl.get('wallet.paste_mnemonic')}>
            {form.getFieldDecorator('mnemonic', {
              initialValue: '',
              rules: [{
                required: true,
                message: intl.get('wallet.mnemonic_tip'),
                validator: (rule, value, cb) => isValidateMnemonic(value) ? cb() : cb(true)
              }]
            })(
              <Input.TextArea size="large" autosize={{minRows: 3, maxRows: 6}} onChange={this.handleMnemonicChange}/>
            )}
          </Form.Item>
          {wallet.name === 'Loopring Wallet' && <Form.Item className="mb25" label={intl.get('wallet.password')}>
            {form.getFieldDecorator('password', {
              initialValue: '',
              rules: [{
                required: wallet.name === 'Loopring Wallet',
                message: intl.get('wallet.password_tip')
              }]
            })(
              <Input size="large" type="password" onChange={this.handlePasswordChange}/>
            )}
          </Form.Item>}

          <Form.Item className="mb15" label={intl.get('wallet.paste_mnemonic')}>
            {form.getFieldDecorator('address', {
              initialValue: '',
              rules: []
            })(
              <Input size="large"/>
            )}
          </Form.Item>

        </Form>

        <Button type="primary" className="d-block w-100" size="large"
                disabled={!this.state.mnemonic || !this.state.isMnemonicValid}
                onClick={this.showAddresses}>{intl.get('wallet.unlock')}</Button>
      </div>
    )
  }

}


export default Form.create()(UnlockByMnemonic)
