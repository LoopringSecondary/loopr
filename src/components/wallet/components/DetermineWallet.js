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

  handlePathChange = (e) => {
    const path = e.target.value;
    const {modal} = this.props;
    const {handlePathChange} = modal;
    handlePathChange(path, () => {
      const pageNum = 0;
      const addresses = window.WALLET.getAddresses(this.state.pageSize, pageNum);
      this.setState({pageNum, addresses, selectedPath: path})
    });

  };
  onCustomPathChange = (e) => {
    const {selectedPath,customPath} =  this.state;
    if(selectedPath === customPath){
      this.setState({customPath: e.target.value,selectedPath:e.target.value});
      this.handlePathChange(e)
    }else{
      this.setState({customPath: e.target.value});
    }
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
    unlockRedirection(pageFrom);
    if(modal.targetModalData) {
      modal.showModal({...modal.targetModalData})
    }
  };

  render() {
    const {addresses,selectedPath,customPath,pageNum} = this.state;
    return (
      <Card title={<div className="fs1 color-black-1">{intl.get('wallet.select_account')}</div>}>
          <div className='bg-grey-50'>
            <div className="bg-white zb-b">
              <div className="zb-b-b fs16 color-primary-1 p10 zb-b-b bg-grey-50">
                1. {intl.get('wallet.select_path')}
              </div>
              <Radio.Group className="" onChange={this.handlePathChange} value={selectedPath}>
                {paths.filter(path => this.isSupported(path.path)).map((item,index)=>
                  <Radio className="d-block zb-b-b p10" value={item.path} key={index}>
                    <span className="color-black-2 fs14 lh20">{item.path}</span>
                    <span className="color-black-3 fs12 ml10">{item.wallet.join(", ")}</span>
                  </Radio>
                )}
                <Radio className="d-block p10" value={customPath}>
                    {intl.get('wallet.custom_path')}
                    <Input
                      className="d-inline ml10"
                      style={{width:'200px'}}
                      value={customPath} onChange={this.onCustomPathChange}
                    />
                </Radio>
              </Radio.Group>
            </div>
            {false &&
              <List
                grid={{column: 12}}
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
                          {item.wallet.join(", ").length <= 40 &&
                            <div className="text-nowrap text-truncate">
                              {item.wallet.join(", ")}
                            </div>
                          }
                          {item.wallet.join(", ").length > 40 &&
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
            }
          </div>
          <div className={`col-6 mb10 ${selectedPath === customPath && 'bg-blue-100 border-blue-200 border' }`}>
          </div>
          <div className='mb10 zb-b'>
            <div className="fs2 color-primary-1 p10 zb-b-b bg-grey-50">2. {intl.get('wallet.select_address')}</div>
            <div className="pl10 pr10">
              {addresses.length > 0 && addresses.map((address, index) => {
                return (
                  <div key={index} className="pt10 pb10 zb-b-b fs14 color-black-2 d-flex justify-content-between row">
                    <span className='col-6'>{address}</span>
                    <Button className='col-auto mr15' size="small" onClick={this.confirm.bind(this, index)}> {intl.get('wallet.import')}</Button>
                  </div>)
              })}
              {
                addresses.length <= 0 && <span className='col-6'>{intl.get('wallet.no_address')}</span>
              }
            </div>
            <div className="d-flex justify-content-between zb-b-t p10">
              <Button onClick={this.previousPage} disabled={pageNum <= 0}>{intl.get('wallet.pre_page')}</Button>
              <Button onClick={this.nextPage}> {intl.get('wallet.next_page')}</Button>
            </div>
          </div>
      </Card>
    )
  }
}
