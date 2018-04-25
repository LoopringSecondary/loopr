import React from 'react';
import {Card, message, List, Input, Icon, Form, Button, Radio,Tooltip} from 'antd'
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



  getBgcolor = (path) =>  {
    const {selectedPath} = this.state;
   if(selectedPath === path){
     return 'bg-blue-100 border-blue-200 border'
   }
   return 'bg-grey-100 border-grey-200 border';
  };

  confirm = (index) => {
    const {modal} = this.props;
    const {pageFrom, setWallet} = modal;
    const {pageNum, pageSize} = this.state;
    setWallet(pageNum * pageSize + index);
    modal.hideModal({id: 'wallet/determineWallet'});
    modal.hideModal({id: 'wallet/unlock'});
    unlockRedirection(pageFrom)
    if(modal.targetModalData) {
      modal.showModal({...modal.targetModalData})
    }
  };

  render() {
    const {addresses,selectedPath,customPath,pageNum} = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Card title={<div className="fs1 color-black-1">{intl.get('wallet.select_account')}</div>}>
          <div className='bg-grey-50'>
            <List
              grid={{column: 3}}
              dataSource={paths.filter(path => this.isSupported(path.path))}
              className='p10'
              renderItem={(item) => (
                <div
                   style={{height: '80px'}}
                   className={`ant-col-8 mt5 mb5`}
                   onClick={this.handlePathChange.bind(this, item.path)}
                >
                    <div className={`${this.getBgcolor(item.path)} p10 ml5 mr5`}>
                      <div className="fs2 color-black-2">
                        {item.path}
                      </div>
                      <div className="fs2 color-black-3">
                        {
                          item.wallet.join(", ").length <= 40 &&
                          <div className="text-nowrap text-truncate">
                            {item.wallet.join(", ")}
                          </div>
                        }
                        {
                          item.wallet.join(", ").length > 40 &&
                          <Tooltip title={item.wallet.join(", ")}>
                            <div className="text-truncate">
                              {item.wallet.join(", ")}
                            </div>
                          </Tooltip>
                        }
                      </div>
                    </div>

                </div>
              )}
            />
          </div>
          <div className={`col-6 mb10 ${selectedPath === customPath && 'bg-blue-100 border-blue-200 border' }`}>
          <div className="fs3 color-black-1 mb5">{intl.get('wallet.custom_path')}</div>
            <div className='mb5'>
            <Input
              addonAfter={<Icon type="caret-right" onClick={this.handlePathChange.bind(this, this.state.customPath)}/>}
              value={customPath} onChange={this.onCustomPathChange}/>
            </div>
          </div>
          <div className='mb10 p10'>
            <div className="fs3 color-black-1 mb5">{intl.get('wallet.select_address')}</div>
            <div>
              {addresses.length > 0 && addresses.map((address, index) => {
                return (
                  <div key={index} className="mb10 fs16 color-black-2 d-flex justify-content-between row"
                       style={radioStyle}>
                    <span className='col-6'>{address}</span>
                    <Button className='col-auto mr20' onClick={this.confirm.bind(this, index)}> {intl.get('wallet.import')}</Button>
                  </div>)
              })}
              {
                addresses.length <= 0 && <span className='col-6'>{intl.get('wallet.no_address')}</span>
              }
            </div>
          </div>
        <div className="pt15 d-flex justify-content-between zb-b-t">
          <Button onClick={this.previousPage} disabled={pageNum <= 0}>{intl.get('wallet.pre_page')}</Button>
          <Button onClick={this.nextPage}> {intl.get('wallet.next_page')}</Button>
        </div>
      </Card>
    )
  }
}
