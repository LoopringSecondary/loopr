import React from 'react';
import {Button, Card, Input, Radio,Icon} from 'antd';
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'
const RadioGroup = Radio.Group;

export default class SelectAccount extends React.Component {
  state = {
    pageNum: 0,
    index: 0,
    pageSize: 5,
  };

  onChange = (e) => {
    this.setState({
      index: e.target.value,
    });
  };

  nextPage = ()=>{
    const {pageNum} = this.state;
    this.setState({pageNum:pageNum+1,index:0})
  };
  previousPage = () =>{
    const {pageNum} = this.state;
    this.setState({pageNum:pageNum -1,index:0})
  };

  cancel = () =>{
    this.props.modal.hideModal({id: 'wallet/selectAccount'});
  };

  confirm = () => {
    const {modals,modal} = this.props;
    const {setWallet} = modals['wallet/selectAccount'];
    const {pageFrom} = modal;
    const {pageNum, index, pageSize} = this.state;
    setWallet(pageNum * pageSize + index);
    modal.hideModal({id: 'wallet/selectAccount'});
    modal.hideModal({id: 'wallet/unlock'});
    unlockRedirection(pageFrom)
  };

  render() {
    const {pageNum, index, pageSize} = this.state;
    const radios = [];
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    addresses.forEach((address, index) => {
      radios.push(<Radio value={index} key={index} className="mb10 fs16 color-black-2">{address}</Radio>)
    });
    return (
      <Card title={intl.get('wallet.select_account')}>
        <RadioGroup onChange={this.onChange} value={index}>
          {radios}
        </RadioGroup>
        <div className="fs14 color-grey-900 pb15 pt5">
          {pageNum >0 &&
            <a className="color-primary-1 mr15" onClick={this.previousPage}>
              <Icon type="left" />
              {intl.get('wallet.pre_page')}
            </a>
          }
          <a className="color-primary-1" onClick={this.nextPage}>
            {intl.get('wallet.next_page')}
            <Icon type="right" />
          </a>
        </div>
        <div className="pt15 d-flex justify-content-between zb-b-t">
          <Button type='default' className='' onClick={this.cancel}>{intl.get('wallet.cancel')}</Button>
          <Button type='primary'  onClick={this.confirm}>{intl.get('wallet.confirm')}</Button>
        </div>
      </Card>
    );
  }
}


