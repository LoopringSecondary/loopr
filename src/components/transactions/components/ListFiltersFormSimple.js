import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,DatePicker} from 'antd';

let FiltersForm = ({
  actions,
  form,
  }) => {
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values)
      if(!err){
        // TODO
        actions.filtersChange({
          filters:values
        })
      }
    })
  }
  function handleChange() {
    setTimeout(handleSubmit, 0) 
  }
  function handleCancle() {
  }
  const types = [
    {label:'All',value:'all'},
    {label:'Transfer',value:'transfer'},
    {label:'Receive',value:'receive'},
    {label:'Sell',value:'sell'},
    {label:'Buy',value:'buy'},
    {label:'Approve',value:'approve'},
    {label:'Cancel Orders',value:'cancel'},
    {label:'Wrap',value:'wrap'},
    {label:'Unwrap',value:'unwrap'},
    {label:'Convert',value:'convert'},
  ]
  return (
      <div>
        <Form layout="inline">
          <Form.Item label="Status" >
            {form.getFieldDecorator('status', {
              initialValue:'all',
              rules:[]
            })(
              <Select
                  style={{ width: 120 }}
                  allowClear
                  placeholder="All"
                  optionFilterProp="children"
                  onChange={handleChange}
                  onFocus={()=>{}}
                  onBlur={()=>{}}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="success">Success</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Type" className="mr0">
            {form.getFieldDecorator('type', {
              initialValue:'all',
              rules:[]
            })(
              <Select
                style={{ width: 120 }}
                allowClear
                onChange={handleChange}
                placeholder="All"

              >
                { 
                  types.map((item,index)=>
                    <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                  )
                }
              </Select>
            )}
          </Form.Item>
          
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
