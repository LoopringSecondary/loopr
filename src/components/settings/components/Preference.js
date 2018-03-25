import React from 'react';
import {Button, Form, Select} from 'antd';
import {locales, timezoneArray} from '../../../common/config/data'
import intl from 'react-intl-universal';


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
    if(type==='language'){
      dispatch({
        type:'locales/setLocale',
        payload:{
          locale:value,
          storage:true,
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
    form.setFieldsValue({language:'en-US', currency:'USD', timezone:'UTC+00:00'})
    handleChange('language', 'en-US')
    handleChange('currency', 'USD')
    handleChange('timezone', 'UTC+00:00')
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
  const localesOptions = locales.map(locale => <Select.Option value={locale.value} key={locale.value}>  <div className="d-flex justify-content-between">
    <div>{locale.name}</div>
    <div>{false && locale.logo}</div>
  </div></Select.Option>)

  return (
    <div className="">
      <Form layout="horizontal" className="p15">
        <Form.Item {...formItemLayout} label={intl.get('settings.language')} colon={false}>
          {form.getFieldDecorator('language', {
            initialValue:preference.language,
            rules:[]
          })(
            <Select
              placeholder="Search/Select"
              size="large"
              onChange={handleChange.bind(this, "language")}
            >
              {localesOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={intl.get('settings.currency')} colon={false}>
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
        <Form.Item {...formItemLayout} label={intl.get('settings.timezone')} colon={false} className="mb0">
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
        <Button onClick={handleReset} type="" className="">{intl.get('settings.reset')}</Button>
      </div>
    </div>
  );
};


export default Form.create()(Perference);


