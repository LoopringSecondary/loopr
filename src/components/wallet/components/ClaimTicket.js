import React from 'react'
import {Card, Form, Input, Button} from 'antd';
import validator from 'Loopring/common/validator'
import {claimTicket,queryTicket} from "../../../common/Loopring/relay/account";
import {toBuffer,toHex} from "../../../common/Loopring/common/formatter";
import intl from 'react-intl-universal'


const Item = Form.Item;
class ClaimTicket extends React.Component {

  state = {
    name: '',
    phone: '',
    email:''
  };

  componentDidMount(){
    const info = Math.floor(new Date().getTime()/1000).toString();
    const sig = window.WALLET.signMessage(info);
    const _this = this;
    claimTicket({address:window.WALLET.getAddress(),timestamp:info,v:sig.v,r:toHex(sig.r),s:toHex(sig.s)}).then(res => {
      if(!res.error){
        _this.setState({...res.result})
      }
    })
  }
  phoneChange = (e) => {
    this.setState({phone:e.target.value})
  };

  nameChange = (e) =>{
    this.setState({name:e.target.value})
  };

  emailChange = (e) =>{
    this.setState({email:e.target.value})
  };
  claim = () =>{
    const {name, phone, email} = this.state;
    this.props.form.validateFields((err, values) => {
      if(!err && name && (phone || email)){
        const info = Math.floor(new Date().getTime()/1000).toString();
        const sig = window.WALLET.signMessage(info);
        claimTicket({name,phone,email,address:window.WALLET.getAddress(),timestamp:info,v:sig.v,r:toHex(sig.r),s:toHex(sig.s)}).then(res => {
          if(!res.error){
            Notification.open({type:'success',message:intl.get('ticket.claim_suc')})
          }else{
            Notification.open({type:'error',message:intl.get('ticket.claim_fail')})
          }
        })
      }else{
        if(!err){
          Notification.open({type:'warning',message:intl.get('ticket.email_phone_tip')})
        }else{
          Notification.open({type:'warning', message: intl.get('ticket.email_tip')})
        }
      }
    })
  };

  validatePhone = (value)  => {
    try{
      validator.validate({type:'PHONE_NUM',value})
    }catch(e){
      return false
    }
  };

  render() {
    const {name, phone,email} = this.state;
    const {form} = this.props;
    return (
      <Card title={intl.get('ticket.title')}>
          <Item label={intl.get('ticket.name')}>
            <Input value={name} onChange={this.nameChange}/>
          </Item>
          <Item label={intl.get('ticket.phone')}>
              <Input className="d-block w-100 fs3" value={phone} placeholder="" onChange={this.phoneChange}/>
          </Item>
        <Form >
          <Item label={intl.get('ticket.email')}>
            {form.getFieldDecorator('email', {
              initialValue: email,
              rules: [{
                message: intl.get('ticket.email_tip'),
                type:'email'
              }]
            })(
              <Input className="d-block w-100 fs3" placeholder="" onChange={this.emailChange}/>
            )}
          </Item>
        </Form>
        <Button type='primary' className="d-block w-100" size="large" onClick={this.claim}>{intl.get('ticket.claim')}</Button>
      </Card>
    )
  }
}

export default Form.create()(ClaimTicket)
