import React from 'react';
import {Button, Form, Input, Upload, Icon, message, Alert} from 'antd';
import {isKeystorePassRequired} from 'Loopring/common/keystore';
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'
import Notification from 'Loopr/Notification'

class UnlockByKeyStore extends React.Component {

  state = {
    fileList: [],
    password: '',
    isPasswordRequired: false,
    keyStore: '',
    loading: false
  };

  handleRemove = (file) => {
    this.setState(({fileList}) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };
  beforeUpload = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try{
        const keyStore = fileReader.result;
        const isPasswordRequired = isKeystorePassRequired(keyStore);
        this.setState({keyStore, isPasswordRequired})
      }catch (e){
        Notification.open({
          type: 'error',
          message: intl.get('wallet.parse_failed'),
          description: e.message
        });
      }
    };
    fileReader.readAsText(file, "utf-8");
    this.setState({fileList: []});
    return false;
  };

  bindEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      try {
        const {keyStore} = this.state;
        const password = e.target.value;
        const {account, modal, pageFrom} = this.props;
        this.setState({
          loading: true
        }, function () {
          account.setKeystore({
            keyStore, password, cb: (e) => {
              if (e) {
                Notification.open({
                  type: 'error',
                  message: intl.get('wallet.decrypt_failed'),
                  description: e.message
                });
                this.setState({
                  loading: false
                })
              } else {
                modal.hideModal({id: 'wallet/unlock'});
                unlockRedirection(pageFrom);
                this.setState({
                  fileList: [],
                  password: '',
                  isPasswordRequired: false,
                  keyStore: '',
                  loading: false
                });
                if(modal.targetModalData) {
                  modal.showModal({...modal.targetModalData})
                }
              }
            }
          });
        });
      } catch (e) {
        message.error(e.message)
      }
    }
  };
  unlock = () => {
    try {
      const {keyStore, password} = this.state;
      const {account, modal, pageFrom} = this.props;
      this.setState({
        loading: true
      }, function () {
        account.setKeystore({
          keyStore, password, cb: (e) => {
            if (e) {
              Notification.open({
                type: 'error',
                message: intl.get('wallet.decrypt_failed'),
                description: e.message
              });
              this.setState({
                loading: false
              })
            } else {
              modal.hideModal({id: 'wallet/unlock'});
              Notification.open({
                message: intl.get('wallet.unlocked_notification_title'),
                description: intl.get('wallet.unlocked_notification_content'),
                type: 'success'
              });
              unlockRedirection(pageFrom);
              this.setState({
                fileList: [],
                password: '',
                isPasswordRequired: false,
                keyStore: '',
                loading: false
              });
              if(modal.targetModalData) {
                modal.showModal({...modal.targetModalData})
              }
            }
          }
        });
      });
    } catch (e) {
      message.error(e.message)
    }
  };

  setPassword = (e) => {
    this.setState({password: e.target.value})
  };

  handleStoreChange = (e) => {
    const text = e.target.value;
    try{
      const isPasswordRequired = isKeystorePassRequired(text);
      this.setState({keyStore:text,isPasswordRequired})
    }catch (e){
      this.setState({keyStore:text,isPasswordRequired:false})
    }
  };

  render() {
    const {isPasswordRequired, fileList, password, keyStore, loading} = this.state;
    const uploadProps = {
      action: '',
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
      fileList
    };
    return (
      <div className="">
        <Alert
          message={<div className="color-red-600 fs18"><Icon
            type="exclamation-circle"/> {intl.get('wallet.not_recommended')}</div>}
          description={<div className="color-red-600">
            <div className="fs14">{intl.getHTML('wallet.instruction_keystore')}</div>
          </div>}
          type="error"
          showIcon={false}
          className="mb15"
        />
        <div className="fs3 color-black-1 mb10">

          <div className="row align-items-center">
            <div className="col">
              {intl.get('wallet.select_keystore')}
            </div>
            <div className="col-auto">
              <Upload {...uploadProps} size="small" >
                <Button>
                  <Icon type="folder" /> {intl.get('wallet.select_json')}
                </Button>
              </Upload>
            </div>
          </div>
        </div>
        <div className='mb20'>
          <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} size="large" className='d-block fs12' value={keyStore} onChange={this.handleStoreChange.bind(this)}/>
        </div>
        {isPasswordRequired &&
        <div className='mb20'>
          <Input  size="large" type="password" placeholder={intl.get('wallet.password')} onChange={this.setPassword.bind(this)}
                 onKeyDown={this.bindEnter.bind(this)}/>
        </div>
        }
        <Button type="primary" className="d-block w-100" size="large" onClick={this.unlock}
                loading={loading}
                disabled={keyStore === '' || (isPasswordRequired && password === "")}>{intl.get('wallet.unlock')}</Button>
      </div>
    )
  }
}


export default Form.create()(UnlockByKeyStore)
