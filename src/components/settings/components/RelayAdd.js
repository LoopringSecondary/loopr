import React from 'react';
import {Button, Card, Form, Input} from 'antd';
import intl from 'react-intl-universal';

const AddRelayForm = ({
  form, settings, modal
  }) => {
  const {relay} = settings
  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      if(!err){
        settings.addRelay({name: values.name, url: values.url})
        modal.hideModal({id:'settings/relay/add'})
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
  return (
    <Card title={intl.get('settings.addRelay')}>
      <Form layout="horizontal" className="">
        <Form.Item label={intl.get('settings.relayName')} colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:'',
            rules:[
              {message: 'Please input valid and distinct relay name',
                validator: (rule, value, cb) => validateRelayName(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large"/>
          )}
        </Form.Item>
        <Form.Item label={intl.get('settings.relayUrl')} colon={false}>
          {form.getFieldDecorator('url', {
            initialValue:'',
            rules:[{type: "url", message : "Not a valid url"}]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <Form.Item className="mb0">
          <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">{intl.get('settings.save')}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};


export default Form.create()(AddRelayForm);


