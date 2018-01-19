import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,Checkbox} from 'antd';

let formOptions = {
  onValuesChange:(props,values)=>{
  }
}

let FiltersForm = ({
  filters,
  fields,
  onSubmit,
  onCancle,
  form,
  }) => {
  function handleSubmit() {
  }
  function handleChanage() {
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
        
        
        <Form layout={formLayout}>
          <Form.Item
            label="Token"
            {...formItemLayout}
          >
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search/Select"
                optionFilterProp="children"
                onChange={handleChange}
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
            label={null}
            {...formItemLayout}
          >
            <Checkbox onChange={handleChange}>Show My Favorite Only</Checkbox>
          </Form.Item>
          <Form.Item
            label={null}
            {...formItemLayout}
          >
            <Checkbox onChange={handleChange}>Hide 0 Balance</Checkbox>
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


export default Form.create(formOptions)(FiltersForm);

 
