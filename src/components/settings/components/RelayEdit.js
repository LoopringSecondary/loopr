import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Card} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const RelayEditForm = ({
    form, settings, modal
  }) => {
  const {relay} = settings
  const relayConfig = relay.nodes.find(item=>item.id === modal.relayId) || {}
  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      if(!err){
        settings.editRelay({id: modal.relayId, name: values.name, url: values.url})
        modal.hideModal({id:'settings/relay/edit'})
      }
    })
  }
  function handleDelete(e) {
    settings.deleteRelay({id: relayConfig.id})
    modal.hideModal({id:'settings/relay/edit'})
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  function validateRelayName(value) {
    if(!value) return false;
    const findByName = relay.nodes.find(item=>item.name === value)
    if(findByName && modal.relayId != findByName.id) return false;
    return true
  }
  return (
    <Card title="Edit Relay">
      <Form layout="horizontal" className="">
        <Form.Item label="Relay Name" colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:relayConfig.name,
            rules:[
              {message: 'Please input valid and distinct relay name',
                validator: (rule, value, cb) => validateRelayName(value) ? cb() : cb(true)
              }
            ]
          })(
            <Input size="large"/>
          )}
        </Form.Item>
        <Form.Item label="Relay URL" colon={false}>
          {form.getFieldDecorator('url', {
            initialValue:relayConfig.value,
            rules:[{type: "url", message : "Not a valid url"}]
          })(
            <Input size="large" />
          )}
        </Form.Item>
        <Form.Item className="mb0">
          <Button onClick={handleSubmit} type="primary" className="d-block w-100 mb15" size="large">Save</Button>
          <Button onClick={handleDelete} type="danger" className="d-block w-100 bg-red-600 border-0 color-white" size="large">Delete</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Form.create()(RelayEditForm);


