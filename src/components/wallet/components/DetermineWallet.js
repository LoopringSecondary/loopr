import React from 'react';
import {Card, message, List, Input, Icon, Form, Button, Radio} from 'antd'
import {paths} from '../../../common/config/data'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'


const ledgerPaths = ["m/44'/60'/0'/0", "m/44'/60'/0'", "m/44'/61'/0'/0", "m/44'/60'/160720'/0'", "m/44'/1'/0'/0"];

export default class DetermineWallet extends React.Component {
  state = {
    pageNum: 0,
    pageSize: 5,
    customPath: "m/44'/60'/1'/0",
    selectedPath: null,
    walletType: null,
    addresses: []
  };
  onChange = (e) => {
    this.setState({
      index: e.target.value,
    });
  };

  componentDidMount() {
    const {pageNum, pageSize} = this.state;
    const {modal} = this.props;
    const {path, walletType} = modal;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    this.setState({addresses, selectedPath: path, walletType})
  }

  nextPage = () => {
    const {pageNum, pageSize} = this.state;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum + 1);
    this.setState({pageNum: pageNum + 1, addresses})
  };
  previousPage = () => {
    const {pageNum, pageSize} = this.state;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum - 1);
    this.setState({pageNum: pageNum - 1, addresses})
  };

  handlePathChange = (path) => {
    const {modal} = this.props;
    const {handlePathChange} = modal;
    handlePathChange(path, () => {
      const pageNum = 0;
      const addresses = window.WALLET.getAddresses(this.state.pageSize, pageNum);
      this.setState({pageNum, addresses, selectedPath: path})
    });

  };
  onCustomPathChange = (e) => {
    this.setState({customPath: e.target.value})
  };

  isSupported = (path) => {
    const {walletType} = this.state;
    if(walletType === 'Ledger'){
      return !!ledgerPaths.find(dpath => dpath === path);
    }
    return true;
  };

  confirm = (index) => {
    const {modal} = this.props;
    const {pageFrom, setWallet} = modal;
    const {pageNum, pageSize} = this.state;
    setWallet(pageNum * pageSize + index);
    modal.hideModal({id: 'wallet/determineWallet'});
    modal.hideModal({id: 'wallet/unlock'});
    unlockRedirection(pageFrom)
  };

  render() {
    const {addresses, selectedPath, pageNum, walletType} = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Card>
        <Form>
          <Form.Item label={intl.get('wallet.select_account')}>
            <List
              grid={{column: 3}}
              dataSource={paths}
              className='mt10'
              renderItem={(item) => (
                <List.Item style={{height: '80px'}}
                           className={`mr10 p10  ${selectedPath === item.path && 'bg-grey-200'}`}>
                  <List.Item.Meta title={item.path} description={item.wallet.join(", ")}
                                  onClick={this.isSupported(item.path) ? this.handlePathChange.bind(this, item.path):() => false}/>
                </List.Item>
              )}
            />
          </Form.Item>
          <Form.Item label={intl.get('wallet.custom_path')} className={`col-6`}>
            <Input
              addonAfter={<Icon type="caret-right" onClick={this.handlePathChange.bind(this, this.state.customPath)}/>}
              value={this.state.customPath} onChange={this.onCustomPathChange}/>
          </Form.Item>
          <Form.Item label={intl.get('wallet.select_address')}>
            {addresses.length > 0 && addresses.map((address, index) => {
              return (
                <div key={index} className="mb10 fs16 color-black-2 d-flex justify-content-between row"
                     style={radioStyle}>
                  <span className='col-6'>{address}</span>
                  <Button className='col-auto mr20' onClick={this.confirm.bind(this, index)}> Import</Button>
                </div>)
            })}
            {
              addresses.length <= 0 && <span className='col-6'>{intl.get('wallet.no_address')}</span>
            }
          </Form.Item>
        </Form>
        <div className="pt15 d-flex justify-content-between zb-b-t">
          <Button onClick={this.previousPage} disabled={pageNum <= 0}>{intl.get('wallet.pre_page')}</Button>
          <Button onClick={this.nextPage}> {intl.get('wallet.next_page')}</Button>
        </div>
      </Card>
    )
  }
}
