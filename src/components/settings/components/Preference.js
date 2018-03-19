import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import {languagesArray, timezoneArray} from '../../../common/config/data'

const Perference = ({
    settings,form,dispatch
  }) => {
  let initPreference = window.STORAGE.settings.get().preference
  let {preference} = settings
  preference = {
    ...preference,
    ...initPreference,
  }
  function handleChange(type, value) {
    console.log(type+" changed to:"+value);
    settings.preferenceChange({[type]: value})
    if(type='language'){
      dispatch({
        type:'locales/localeChange',
        payload:{
          locale:value
        }
      })
    }
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
    <div className="">
      <Form layout="horizontal" className="p15">
        <Form.Item {...formItemLayout} label="Language" colon={false}>
          {form.getFieldDecorator('language', {
            initialValue:preference.language,
            rules:[]
          })(
            <Select
              placeholder="Search/Select"
              size="large"
              onChange={handleChange.bind(this, "language")}
            >
              {languagesArray && languagesArray.map((item,index)=>
                <Select.Option value={item.language} key={index}>
                  <div className="d-flex justify-content-between">
                    <div>{item.value.display}</div>
                    <div>{false && item.value.logo}</div>
                  </div>
                </Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Currency" colon={false}>
          {form.getFieldDecorator('currency', {
            initialValue:preference.currency,
            rules:[]
          })(
            <Select
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
        <Form.Item {...formItemLayout} label="Timezone" colon={false} className="mb0">
          {form.getFieldDecorator('timezone', {
            initialValue:preference.timezone,
            rules:[]
          })(
            <Select
              placeholder="Search/Select"
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "timezone")}
            >
              {timezoneArray && timezoneArray.map((item, index)=>
                <Select.Option key={index} value={item.timezone} title={"("+item.timezone+") "+item.principal}>({item.timezone}) {item.principal}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
      </Form>
      <div className="p15 zb-b-t text-right">
        <Button onClick={handleReset} type="" className="">Reset</Button>
      </div>
    </div>
  );
};


export default Form.create()(Perference);


