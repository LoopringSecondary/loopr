import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button,Form,Radio,Input,Tabs,Card,Badge,Icon,Modal,Progress } from 'antd';
import UnlockByMetaMask from './UnlockByMetaMask'
import UnlockByKeystore from './UnlockByKeystore'

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
    this.setState({
      value,
      strength
    })
  }
  getStrength(value){
    if(value.length<=6){
      return 'weak'
    }
    if(6 < value.length <= 10){
      return 'average'
    }
    if(value.length > 10){
      console.log('value.length',value.length)
      return 'strong'
    }
  }
  render() {
    const {modals} = this.props
    const {visible,strength,disabled,value} = this.state

    const handelSubmit = ()=>{
      modals.hideModal({id:'wallet/generate'})
      modals.showModal({id:'wallet/backup'})
    }
    const gotoUnlock = ()=>{
      modals.hideModal({id:'wallet/generate'})
      modals.showModal({id:'wallet/unlock'})
    }
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
        <Button disabled={disabled} onClick={handelSubmit} className="w-100 d-block mt15" type="primary" size="large" >Generate Now</Button>
        <div className="fs14 color-grey-900 text-center pt10 pb10">
          Already have a wallet ? <a className="color-blue-600 ml5" onClick={gotoUnlock}>Click to unlock</a> !
        </div>
      </Card>
    );
  }
}

