import React from 'react'
import {Card, Form, Input, Button} from 'antd';
import validator from 'Loopring/common/validator'
import {claimTicket} from "../../../common/Loopring/relay/account";
import {toBuffer,toHex} from "../../../common/Loopring/common/formatter";

const Item = Form.Item;
class ClaimTicket extends React.Component {

  state = {
    name: '',
    phone: '',
  };

  componentDidMount() {

  }

  phoneChange = (e) => {
    this.setState({phone:e.target.value})
  };

  nameChange = (e) =>{
    this.setState({name:e.target.value})
  };

  claim = () =>{
    const {name, phone, email} = this.state;
    this.props.form.validateFields((err, values) => {
      if(!err && name){
        const info = Buffer.concat([toBuffer(phone),toBuffer(email)])
        const sig = window.WALLET.signMessage(info);
        claimTicket({name,phone,email,address:window.WALLET.getAddress(),v:sig.v,r:toHex(sig.r),s:toHex(sig.s)}).then(res => {
          if(!res.error){
            Notification.open({type:'success',message:'领取成功'})
          }
        })
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
    const {name, phone} = this.state;
    const {form} = this.props;
    return (
      <Card title='领取数字经济领袖峰会门票'>
        <Form >
          <Item label='姓名'>
            <Input value={name} onChange={this.nameChange}/>
          </Item>
          <Item>
            {form.getFieldDecorator('电话', {
              initialValue: {phone},
              rules: [{
                message: '不合法的电话',
                required:true,
                validator: (rule, value, cb) => this.validatePhone(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100 fs3" placeholder="" onChange={this.phoneChange}/>
            )}
          </Item>
        </Form>
        <Button onClick={this.claim}>领取门票</Button>
      </Card>
    )
  }
}

export default Form.create()(ClaimTicket)
