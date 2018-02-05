import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import ModalContainer from '../../../modules/modals/container'
import RelayAdd from './RelayAdd'
import RelayEdit from './RelayEdit'

const RealySettingForm = ({
    settings,form,modals
  }) => {
  const {relay} = settings
  const relayConfig = relay.nodes.find(item=>item.id === relay.selected) || {}
  const gotoEdit = (relayId, e)=>{
    //e.preventDefault();
    modals.showModal({id:'settings/relay/edit', relayId:relayId})
  }
  const gotoAdd = ()=>{
    modals.showModal({id:'settings/relay/add'})
  }
  function handleChange(e) {
    settings.relayChange({...relay, selected:e.target.value})
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <div className="" >
      <Form layout="horizontal" className="p15">
        <Form.Item label="Choose Relay" colon={false}>
          {form.getFieldDecorator('relay', {
            initialValue:relayConfig.value,
            rules:[]
          })(
            <Radio.Group className="" onChange={handleChange}>
              {
                relay.nodes.map((item,index)=>
                  <Radio className="d-flex align-items-center mb15 w-100" value={item.value} key={index}>
                    <div className="ml10">
                      <div className="row align-items-center no-gutters">
                        <div className="col-7 mr10">
                          <Input size="large" value={item.name}  disabled/>
                        </div>
                        <div className="col mr10">
                          <Input size="large" value={item.value} disabled/>
                        </div>
                        <div className="col-auto">
                          { item.custom &&
                            <a href="javascript:void(0)" onClick={gotoEdit.bind(this, item.id)} className="">Edit</a>
                          }
                        </div>
                      </div>
                    </div>
                  </Radio>
                )
              }
            </Radio.Group>
          )}
        </Form.Item>

      </Form>
      <div className="p15 zb-b-t text-right">
        <Button onClick={handleReset} type="" className="mr5">Reset</Button>
        <Button type="primary" onClick={gotoAdd} className="">Add Cutom Relay</Button>
      </div>
    </div>
  );
};


export default Form.create()(RealySettingForm);


