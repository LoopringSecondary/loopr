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
      value:''
    }
  }
  togglePassword(){
    this.setState({
      visible:!this.state.visible
    })
  }
  passwordChange(value){
    console.log('value',value)
  }

  render() {
    const {dispatch} = this.props
    const showModal = ()=>{
        dispatch({
          type:'modals/modalChange',
          payload:{
            id:'wallet/backup',
            visible:true,
          }
        })
    }
    const hideModal = ()=>{
        dispatch({
          type:'modals/modalChange',
          payload:{
            id:'wallet/generate',
            visible:false,
          }
        })
    }

    const handelSubmit = ()=>{
      hideModal()
      showModal()
    }
    const footer = (
      <div className="fs14 color-grey-900 text-center pt10 pb10">
        Already have a wallet ? <a className="color-blue-600 ml5">Click to unlock</a> !
      </div>
    )
    const passwordVisible = (
        <div className="fs14 pl5 pr5">
          {
            this.state.visible && <i className="fa fa-eye" onClick={this.togglePassword.bind(this)}></i>
          }
          {
            !this.state.visible && <i className="fa fa-eye-slash" onClick={this.togglePassword.bind(this)}></i>
          }
        </div>
    )
    const progressFormat = (percent)=>{
      return (
        'Strong'
      )
    }

    return (
      <Card title='Generate Wallet'>
        <Input 
          type={this.state.visible ? 'text' : 'password'} 
          size="large" 
          placeholder="Set a strong password"
          addonAfter={passwordVisible}
          onChange={this.passwordChange.bind(this)}
        />
        <div className="row pt10 pb10">
          <div className="col-auto pr0">
            <span className="fs12 color-grey-900">Password Strength</span>
          </div>
          <div className="col-5">
            <Progress className="d-inline-block" percent={80} strokeWidth={4}  status="success" showInfo={false}  format={progressFormat}/>
          </div>
        </div>
        <Button onClick={handelSubmit} className="w-100 d-block mt15" type="primary" size="large" >Generate Now</Button>
      </Card>
    );
  }
}

