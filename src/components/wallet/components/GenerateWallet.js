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
    }
  }
  togglePassword(){
    this.setState({
      visible:!this.state.visible
    })
  }
  passwordChange(value){
  }

  render() {
    const footer = (
      <div className="fs14 color-grey-900 text-center pt10 pb10">
        Already have a wallet ? <a className="color-blue-600 ml5">Click to unlock</a> !
      </div>
    )
    const passwordVisible = (
        <div className="fs14">
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
      <div className="row align-items-center justify-content-center">
        <div className="col-6">
          <Modal title="Generate Wallet" visible={true} footer={footer}>
            <Input 
              type={this.state.visible ? 'text' : 'password'} 
              size="large" 
              addonAfter={passwordVisible}
              onChange={this.passwordChange.bind(this)}
            />
            <div className="row pt10 pb10">
              <div className="col-auto pr0">
                <span className="fs12 color-grey-900">Password Strength</span>
              </div>
              <div className="col-5">
                <Progress className="d-inline-block" percent={80} strokeWidth={4}  status="success" showInfo={'Strong'}  format={progressFormat}/>
              </div>
            </div>
            <Button className="w-100 d-block mt15" type="primary" size="large" >Generate Now</Button>
          </Modal>
        </div>
      </div>
    );
  }
}

