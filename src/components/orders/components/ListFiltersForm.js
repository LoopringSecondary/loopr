import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';

let formOptions = {
  onFieldsChange:(props,values)=>{
    console.log('values1',values);
  },
  onValuesChange:(props,values)=>{
    console.log('values1',values);
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
    form.validateFields((err,values) => {
      console.log('values2',values);
      if(!err){
        // TODO
      }
    }); 
  }
  function handleChange() {
      handleSubmit()
  }
  function handleCancle() {
  }
  function handleReset() {
  }

  let formLayout = 'inline'
  return (
      <div>
        <div className="emp15"></div>
        <Form layout="inline">
          <Form.Item label="Market" >
            {form.getFieldDecorator('token', {
              initialValue:'',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{width:'200px'}}
                  placeholder="search"
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="LRC/ETH">LRC/ETH</Select.Option>
                  <Select.Option value="USDT/ETH">USDT/ETH</Select.Option>
                  <Select.Option value="BNB/ETH">BNB/ETH</Select.Option>
                </Select>
            )}
          </Form.Item>
          <Form.Item label="Side" >
            {form.getFieldDecorator('side', {
              initialValue:'all',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="sell">Sell</Radio.Button>
                <Radio.Button value="buy">Buy</Radio.Button>
              </Radio.Group>
            )}
            
          </Form.Item>
          <Form.Item label="Status" >
            {form.getFieldDecorator('status', {
              initialValue:'all',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="completed">Completed</Radio.Button>
                <Radio.Button value="pending">Pending</Radio.Button>
                <Radio.Button value="canceled">Canceled</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create(formOptions)(FiltersForm);

 
