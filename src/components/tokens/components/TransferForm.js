import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,Checkbox} from 'antd';

let FiltersForm = ({
  filters,
  fields,
  onSubmit,
  onCancle,
  form,
  }) => {
  function handleSubmit() {
  }
  function handleCancle() {
  }
  function handleReset() {
  }

  let formLayout = 'vertical'
  let formItemLayout = {}
  let buttonItemLayout = {}

  if( formLayout == 'horizontal'){
    formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }
    buttonItemLayout ={
      wrapperCol: { span: 14, offset: 4 },
    }
  }
  if( formLayout == 'inline'){
    formItemLayout = {}
    buttonItemLayout={}
  }
  if( formLayout == 'vertical'){
    formItemLayout = {}
    buttonItemLayout={}
  }
  return (
      <div>
        <div className="emp15"></div>
        {
          false &&
          <div>
            <Button size="large" type="primary" onClick={handleSubmit} className="mr10"><Icon type="search"></Icon>搜索</Button>
            <Button size="large" type="ghost" onClick={handleReset} className="mr10">重置</Button>
            <Button size="large" type="ghost" onClick={handleCancle}>取消</Button>
          </div>
        }
        <Form layout={formLayout}>
          <Form.Item
            label="Token"
            {...formItemLayout}
          >
            <Select
                showSearch
                placeholder="search"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
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
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="Amount To Send"
            {...formItemLayout}
          >
            <Input placeholder="" />
          </Form.Item>

          <Form.Item
            label={null}
            {...formItemLayout}
          >
            
          </Form.Item>

          {
            false &&
            <Form.Item {...buttonItemLayout}>
              <Button type="primary" className="mr10">Submit</Button>
              <Button type="default">Reset</Button>
            </Form.Item>
          }
          
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
