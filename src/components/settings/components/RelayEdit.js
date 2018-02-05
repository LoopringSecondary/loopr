import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Card} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const RelayEditForm = ({
    form, settings, modal, modals
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
        modals.hideModal({id:'settings/relay/edit'})
      }
    })
  }
  function handleDelete(relayId, _this) {
    settings.deleteRelay({id: relayId})
    modals.hideModal({id:'settings/relay/edit'})
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
  function validateUrl(value) {
    if(!value) return false;
    const strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      + "|" // 允许IP和DOMAIN（域名）
      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      + "[a-z]{2,6})" // first level domain- .com or .museum
      + "(:[0-9]{1,4})?" // 端口- :80
      + "((/?)|" // a slash isn't required if there is no file name
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    if (re.test(value)){
      return true
    } else {
      return false
    }
  }
  return (
    <Card title="Edit Relay">
      <Form layout="horizontal" className="">
        <Form.Item label="Relay Name" colon={false}>
          {form.getFieldDecorator('name', {
            initialValue:relayConfig.name,
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
            initialValue:relayConfig.value,
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
          <Button onClick={handleSubmit} type="primary" className="d-block w-100 mb15" size="large">Save</Button>
          <Button onClick={handleDelete.bind(this, relayConfig.id)} type="danger" className="d-block w-100 bg-red-600 border-0 color-white" size="large">Delete</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Form.create()(RelayEditForm);


