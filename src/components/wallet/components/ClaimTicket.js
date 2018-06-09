import React from 'react'
import {Card, Form, Input, Button} from 'antd';
import validator from 'Loopring/common/validator'
import {claimTicket} from "../../../common/Loopring/relay/account";
import {toBuffer} from "../../../common/Loopring/common/formatter";
import {hashPersonalMessage,sha3,ecsign} from 'ethereumjs-util'

const Item = Form.Item
class ClaimTicket extends React.Component {

  state = {
    name: '',
    phone: '',
    email: ''
  };

  componentDidMount() {

  }

  phoneChange = (e) => {
    this.setState({phone:e.target.value})
  };

  nameChange = (e) =>{
    this.setState({name:e.target.value})
  }

  emailChange = (e) =>{
    this.setState({email:e.target.value})
  };

  claim = () =>{
    const {name, phone, email} = this.state;
    this.props.form.validateFields((err, values) => {
      if(!err && name){
        const info = Buffer.concat([toBuffer(phone),toBuffer(email)])
        const hash = hashPersonalMessage(sha3(info))
        const sig = ecsign(hash,)
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
    const {name, phone, email} = this.state;

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
        <Item>
          {form.getFieldDecorator('邮箱', {
            initialValue: {email},
            rules: [{
              message: '不合法的邮箱',
              required:true,
              type:'email'
            }]
          })(
            <Input className="d-block w-100 fs3" placeholder="" onChange={this.emailChange}/>
          )}
        </Item>
        </Form>
        <Button onClick={claim} ></Button>
      </Card>
    )
  }


}
