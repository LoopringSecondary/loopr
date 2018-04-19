import React from 'react';
import {Form,Button,Popconfirm,Alert} from 'antd';
import icon from '../../../assets/images/icon-backup-wallet.png'
import {download} from "Loopring/ethereum/account"
import intl from 'react-intl-universal';

class BackupKeystore extends React.Component {

  state = {
    fileName: null,
    blob: null
  };

  componentDidMount() {
    const file = window.WALLET.download();
    this.setState({...file})
  }
  render() {
    const {fileName, blob} = this.state;
    const gotoWallet = ()=>{
      this.props.modal.hideThisModal()
      window.routeActions.gotoPath('/wallet')
    }
    return (
      <div>
        <div className="text-left">
          <Alert
            //  message={intl.get('wallet.backup.not_lose') + " !"}
            description={intl.get('wallet.backup.backup_tip')}
            type="error"
            iconType="exclamation-circle"
            showIcon
            className=""
          />
        </div>
        <a href={blob}
           download={fileName}
           className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
          {intl.get('wallet.backup.download')}</a>
        <Popconfirm title={intl.get('wallet.backup.confirm_to_leave_backup_page')} overlayClassName="origin" onConfirm={gotoWallet} okText={intl.get('global.yes')} cancelText={intl.get('global.no')}>
            <Button type="default" size="large" className="d-block w-100 mt10">
            {intl.get('wallet.backup.leave_backup_page')}
            </Button>
        </Popconfirm>
      </div>
    )
  }
}


export default Form.create()(BackupKeystore)
