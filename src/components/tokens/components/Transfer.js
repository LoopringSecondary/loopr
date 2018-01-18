import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';

let Transfer = ({
  form,
  modal,
  }) => {
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
        modal.hideModal('transfer')
        modal.showModal('transfer/preview')
      }
    });
  }
  function handleCancle() {
    modal.hideModal('transfer')
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    if(modal.state && modal['transfer']){
      const values = form.getFieldsValue()
      const transfer = modal.state['transfer'].data
      if(transfer.token && values['token'] != transfer['token'] ){
        form.resetFields()
      }
    }
  }
  resetForm()
  return (
      <div>
        <Form layout="vertical">
          <Form.Item label="Token">
            {form.getFieldDecorator('token', {
              initialValue:'',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  placeholder="Search/Select"
                  optionFilterProp="children"
                  size="large"
                  disabled
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="LRC">LRC</Select.Option>
                  <Select.Option value="lucy">USDT</Select.Option>
                  <Select.Option value="tom">BNB</Select.Option>
              </Select>
            )}
            
          </Form.Item>
          <Form.Item label="Recipient">
            {form.getFieldDecorator('to', {
              initialValue:'',
              rules:[]
            })(
              <Input placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item label="Amount To Send">
            {form.getFieldDecorator('amount', {
              initialValue:0,
              rules:[]
            })(
              <Input className="d-block w-100" placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item label="GasLimit">
            {form.getFieldDecorator('gasLimit', {
              initialValue:8400,
              rules:[]
            })(
              <Slider min={2100} max={21000} step={2100} 
                marks={{
                  2100: '2100',
                  4200: '4200',
                  8400: '8400',
                  16800: '16800',
                  21000: {
                    label: '21000'
                  }
                }} 
              />
            )}
          </Form.Item>
          <Form.Item >
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(Transfer);

 
