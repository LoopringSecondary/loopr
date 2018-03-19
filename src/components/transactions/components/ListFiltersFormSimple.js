import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,DatePicker} from 'antd';

let FiltersForm = ({
  LIST,
  actions,
  form,
  }) => {
  const {filters} = LIST
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
    {label:'All',value:''},
    {label:'Send',value:'send'},
    {label:'Receive',value:'receive'},
    {label:'Enable',value:'approve'},
    {label:'Convert',value:'convert'},
  ]
  return (
      <div>
        <Form layout="inline">
          <Form.Item label="Status" >
            {form.getFieldDecorator('status', {
              initialValue:filters.status || '',
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
                <Select.Option value="">All</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="success">Success</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Type" className="mr0">
            {form.getFieldDecorator('txType', {
              initialValue: filters.type || '',
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


