import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import ModalContainer from '../../../modules/modals/container'
import RelayAdd from './RelayAdd'
import RelayEdit from './RelayEdit'

const RealySettingForm = ({
    settings,form,modals,dispatch
  }) => {
  const showEditModal = (e)=>{
    e.preventDefault();
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:'setting/relay/edit',
        visible:true,
      }
    })
  }
  const showAddModal = ()=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        id:'setting/relay/add',
        visible:true,
      }
    })
  }

  function handleChange(type, value) {
    console.log(type+":"+value);
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
      <Form layout="horizontal" className="">
        <Form.Item label="Choose Relay" colon={false}>
          {form.getFieldDecorator('relay', {
            initialValue:2,
            rules:[]
          })(
            <Radio.Group className="">
              {
                [1,2,3].map((item,index)=>
                  <Radio className="d-flex align-items-center mb15 w-100" value={item} key={index}>
                    <div className="ml10">
                      <div className="row align-items-center no-gutters">
                        <div className="col-7 mr10">
                          <Input size="large" value="Default Loopring Relay"  />
                        </div>
                        <div className="col mr10">
                          <Input size="large" value="27.0.0.01" />
                        </div>
                        <div className="col-auto">
                          <a href="" onClick={showEditModal} className="">Edit</a>
                        </div>
                      </div>
                    </div>
                  </Radio>
                )
              }
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button type="primary" onClick={showAddModal} className="">Add Cutom Relay</Button>
            </div>
          </div>
        </Form.Item>
      </Form>
      <ModalContainer id='setting/relay/add' title="Add Relay">
        <RelayAdd />
      </ModalContainer>
      <ModalContainer id='setting/relay/edit' title="Edit Relay">
        <RelayEdit />
      </ModalContainer>
    </div>
  );
};


export default Form.create()(connect(({modals})=>(modals))(RealySettingForm));


