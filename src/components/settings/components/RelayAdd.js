import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Card} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'
import {url} from '../../../common/utils/regx'

const AddRelayForm = ({
  form, settings, modal, modals
  }) => {
  const {relay} = settings
  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      if(!err){
        settings.addRelay({name: values.name, url: values.url})
        modals.hideModal({id:'settings/relay/add'})
      }
    });
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  function validateRelayName(value) {
    if(!value) return false;
    return !relay.nodes.find(item=>item.name === value)
  }
  function validateUrl(value) {
    if(!value) return false;
    var re = new RegExp(url);
    if (re.test(value)){
      return true
    } else {
      return false
    }
  }
  return (
    <Card title="Add Relay">
      <Form layout="horizontal" className="">
        <Form.Item label="Relay Name" colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:'',
            rules:[
              {required: true, message: 'Please input valid and distinct relay name',
                validator: (rule, value, cb) => validateRelayName(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large"/>
          )}
        </Form.Item>
        <Form.Item label="Relay URL" colon={false}>
          {form.getFieldDecorator('url', {
            initialValue:'',
            rules:[
              {required: true, message: 'Please input valid url',
                validator: (rule, value, cb) => validateUrl(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <Form.Item className="mb0">
          <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Save</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};


export default Form.create()(AddRelayForm);


