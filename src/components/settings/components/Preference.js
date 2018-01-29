import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import './Preference.less'
import {languagesArray, timezoneArray} from '../../../common/config/data'

// filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

const Perference = ({
    settings,form
  }) => {
  const {preference} = settings

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
      <Form layout="horizontal" className="d-flex flex-column preference-form">
        <Form.Item {...formItemLayout} label="Language" colon={false}>
          {form.getFieldDecorator('language', {
            initialValue:'en',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              
              onChange={handleChange.bind(this, "language")}
            >
              {languagesArray && languagesArray.map((item,index)=>
                <Select.Option value={item.language} key={index}>
                  <div className="d-flex justify-content-between">
                    <div>{item.value.display}</div>
                    <div>{item.value.logo}</div>
                  </div>
                </Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Currency" colon={false}>
          {form.getFieldDecorator('currency', {
            initialValue:'USD',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "currency")}
            >
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="CNY">CNY</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Timezone" colon={false}>
          {form.getFieldDecorator('timezone', {
            initialValue:'',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "timezone")}
            >
              {timezoneArray && timezoneArray.map((item, index)=>
                <Select.Option value={item.timezone} title={"("+item.timezone+") "+item.principal}>({item.timezone}) {item.principal}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item className="">
          <div className="row">
            <div className="col">
              <Button onClick={handleReset} type="" className="">Reset</Button>
            </div>
          </div>
        </Form.Item>
        
      </Form>
    </div>
  );
};


export default Form.create()(Perference);


