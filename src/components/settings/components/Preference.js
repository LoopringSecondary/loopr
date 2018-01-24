import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import './Preference.less'
import {languagesArray, timezoneArray} from '../../../common/config/data'

const Layout = (props)=>{
  return (
      <div className="d-flex flex-column" style={{height:'420px'}}>
        <div className="mb-auto">
          Body
          <br/>
          <br/>
          Body
        </div>
        <div className="">
          Footer
        </div>
      </div>
  )
}
let Perference = ({
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
  resetForm()
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
    <div className="pt20" >
      <Form layout="horizontal" style={{height:'420px'}} className="d-flex flex-column preference-form">

        <Form.Item {...formItemLayout} label="Language" colon={false}>
          {form.getFieldDecorator('token', {
            initialValue:'',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChange.bind(this, "language")}
            >
              {languagesArray && languagesArray.map((item,index)=>
                <Select.Option value={item.language}>
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
          {form.getFieldDecorator('to', {
            initialValue:'',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChange.bind(this, "currency")}
            >
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="CNY">CNY</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Timezone" colon={false}>
          {form.getFieldDecorator('amount', {
            initialValue:'',
            rules:[]
          })(
            <Select
              showSearch
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChange.bind(this, "timezone")}
            >
              {timezoneArray && timezoneArray.map((item, index)=>
                <Select.Option value={item.timezone} title={"("+item.timezone+") "+item.principal}>({item.timezone}) {item.principal}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>

        <Form.Item className="mt-auto">
          <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Save</Button>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create()(Perference);


