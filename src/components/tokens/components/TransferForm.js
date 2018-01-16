import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';

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

  const sliderMarks = {
    0: '2100',
    100: {
      label: '21000'
    },
  };
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
            <Button type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
