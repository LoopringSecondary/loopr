import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';

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
            label="Market"
            {...formItemLayout}
          >
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="search"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="jack">LRC/ETH</Select.Option>
                <Select.Option value="lucy">USDT/ETH</Select.Option>
                <Select.Option value="tom">BNB/ETH</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item
            label="Side"
            {...formItemLayout}
          >
            <Radio.Group defaultValue="all" >
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="horizontal">Sell</Radio.Button>
              <Radio.Button value="vertical">Buy</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Status"
            {...formItemLayout}
          >
            <Radio.Group defaultValue="all" >
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="completed">Completed</Radio.Button>
              <Radio.Button value="pending">Pending</Radio.Button>
              <Radio.Button value="canceled">Canceled</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            {
              false &&
              <Button type="primary" className="mr10">Submit</Button>
            }
            <Button type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
