import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon,Modal,Progress } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'
import {create} from "Loopring/ethereum/account"
export default class GenerateWallet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible:false,
      strength:'',
      disabled:true,
      value:''
    }
  }
  togglePassword(){
    this.setState({
      visible:!this.state.visible
    })
  }
  passwordChange(e){
    const value = e.target.value
    const strength = this.getStrength(value)
    const disabled = value.length <= 6;
    this.setState({
      value,
      strength,
      disabled
    })
  }
  getStrength(value){
    if(value.length<=6){
      return 'weak'
    }
    if(value.length > 10){
      return 'strong'
    }
    if(6 < value.length <= 10){
      return 'average'
    }
  }
  handelSubmit(){
    const {modals} = this.props;
    modals.showLoading({id:'wallet/generate'});
    setTimeout(()=>{
      const account = create(this.state.value);
      // TODO dispatch action to store account in redux
      this.setState({value:null});
      modals.hideLoading({id:'wallet/generate'});
      modals.hideModal({id:'wallet/generate'});
      modals.showModal({id:'wallet/backup'})
    }, 3000);

  }
  gotoUnlock(){
    const {modals} = this.props
    modals.hideModal({id:'wallet/generate'})
    modals.showModal({id:'wallet/unlock'})
  }
  render() {
    const {visible,strength,disabled,value} = this.state;
    const {modals} = this.props;
    const loading= modals['wallet/generate'] && modals['wallet/generate']['loading']

    const visibleIcon = (
        <div className="fs14 pl5 pr5">
          { visible &&
            <i className="fa fa-eye" onClick={this.togglePassword.bind(this)}></i>
          }
          { !visible &&
            <i className="fa fa-eye-slash" onClick={this.togglePassword.bind(this)}></i>
          }
        </div>
    )
    return (
      <Card title='Generate Wallet'>
        <Input
          type={visible ? 'text' : 'password'}
          value={value}
          size="large"
          placeholder="Set a strong password"
          addonAfter={visibleIcon}
          onChange={this.passwordChange.bind(this)}
        />
        {
          value &&
          <div className="row pt10 pb10">
            <div className="col-auto pr0">
              <span className="fs12 color-grey-900">Password Strength</span>
            </div>
            <div className="col-5">
              { strength == 'weak' &&
                <Progress className="d-inline-block" percent={30} strokeWidth={4}  status="exception" format={()=>strength}/>
              }
              { strength == 'average' &&
                <Progress className="d-inline-block" percent={60} strokeWidth={4}  status="active" format={()=>strength}/>
              }
              { strength == 'strong' &&
                <Progress className="d-inline-block" percent={90} strokeWidth={4}  status="success" format={()=>strength}/>
              }
            </div>
          </div>
        }
        <div className="mb25"></div>
        <Button disabled={disabled} loading={loading} onClick={this.handelSubmit.bind(this)} className="w-100 d-block mt15" type="primary" size="large" >
        Generate Now
        </Button>
        <div className="fs14 color-grey-900 text-center pt20 zb-b-t mt20">
          Already have a wallet ?
          <a className="color-blue-600 ml5" onClick={this.gotoUnlock.bind(this)}>
          Click to unlock !
          </a>
        </div>
      </Card>
    );
  }
}

