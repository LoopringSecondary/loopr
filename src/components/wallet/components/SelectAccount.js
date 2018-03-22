import React from 'react';
import {Button, Card, Input, Radio} from 'antd';
import intl from 'react-intl-universal';
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
    const {pageNum, index, pageSize} = this.state;
    setWallet(pageNum * pageSize + index);
    modal.hideModal({id: 'wallet/selectAccount'});
    modal.hideModal({id: 'wallet/unlock'});
    window.routeActions.gotoPath('/wallet/portfolio');
  };

  render() {
    const {pageNum, index, pageSize} = this.state;
    const radios = [];
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    addresses.forEach((address, index) => {
      radios.push(<Radio value={index} key={index} className="mb10 fs16">{address}</Radio>)
    });
    return (
      <Card title={intl.get('wallet.select_account')}>
        <RadioGroup onChange={this.onChange} value={index}>
          {radios}
        </RadioGroup>
        <div className="zb-b-b fs14 color-grey-900 p10 pl15 pr15">
          {pageNum >0 && <a onClick={this.previousPage}>{intl.get('wallet.pre_page')}
          </a>}
          <a onClick={this.nextPage}>{intl.get('wallet.next_page')}
          </a>
        </div>
        <div>
          <Button type='primary' className='mr20' onClick={this.cancel}>{intl.get('wallet.cancel')}</Button>
          <Button type='primary'  onClick={this.confirm}>{intl.get('wallet.confirm')}</Button>
        </div>
      </Card>
    );
  }
}


