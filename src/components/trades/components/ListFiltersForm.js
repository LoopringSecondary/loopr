import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';

let FiltersForm = ({
  form,
  actions,
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
  function handleReset() {
    form.resetFields()
    handleSubmit()
  }

  let formLayout = 'inline'
  return (
      <div className="">
        <Form layout="inline">
          <Form.Item label="Market" >
            {form.getFieldDecorator('pair', {
              initialValue:'all',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{ width: 120 }}
                  placeholder="Search"
                  optionFilterProp="children"
                  onChange={handleChange}
                  onFocus={()=>{}}
                  onBlur={()=>{}}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="jack">LRC/ETH</Select.Option>
                  <Select.Option value="lucy">USDT/ETH</Select.Option>
                  <Select.Option value="tom">BNB/ETH</Select.Option>
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
          <Form.Item>
            <Button onClick={handleReset} type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
