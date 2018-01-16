import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,DatePicker} from 'antd';

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

  let formLayout = 'inline'
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
                showSeach={true}
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="LRC">LRC</Select.Option>
                <Select.Option value="ETH">ETH</Select.Option>
                <Select.Option value="BTC">BTC</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            label="Type"
            {...formItemLayout}
          >
            <Select
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="Transfer">Transfer</Select.Option>
                <Select.Option value="Receive">Receive</Select.Option>
                <Select.Option value="Convert">Convert</Select.Option>
                <Select.Option value="Approve">Approve</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            label="Time"
            {...formItemLayout}
          >
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
