import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';

let Transfer = ({
  form,
  modal,
  }) => {
  function handleSubmit() {
    modal.hideModal('transfer')
    form.validateFields((err,values) => {
      // console.log('values',values);
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
    
  }
  function handleCancle() {
    modal.hideModal('transfer')
  }
  function handleReset() {

  }
  let formLayout = 'vertical'
  let formItemLayout = {}
  let buttonItemLayout = {}

  return (
      <div>
        <Form layout={formLayout}>
          <Form.Item
            label="Token"
            {...formItemLayout}
          >
            <Select
                showSearch
                placeholder="Search/Select"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                size="large"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="jack">LRC</Select.Option>
                <Select.Option value="lucy">USDT</Select.Option>
                <Select.Option value="tom">BNB</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            label="Recipient"
            {...formItemLayout}
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item
            label="Amount To Send"
            {...formItemLayout}
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item
            label="GasLimit"
            {...formItemLayout}
          >
            <Slider min={2100} max={21000} step={2100} defaultValue={8400} 
              marks={{
                2100: '2100',
                8400: '8400',
                21000: {
                  label: '21000'
                }
              }} 
            />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(Transfer);

 
