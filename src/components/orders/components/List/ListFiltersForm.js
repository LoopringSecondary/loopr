import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';

let FiltersForm = ({
  form,
  LIST,
  actions,
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
  function handleReset() {
    form.resetFields()
  }

  let formLayout = 'inline'
  return (
      <div className="">
        <Form layout="inline">
          <Form.Item label="Market" >
            {form.getFieldDecorator('market', {
              initialValue: filters.market || 'ALL',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{width:'120px'}}
                  placeholder="Search/Select"
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="ALL">All</Select.Option>
                  <Select.Option value="LRC-ETH">LRC-ETH</Select.Option>
                  <Select.Option value="USDT-ETH">USDT-ETH</Select.Option>
                  <Select.Option value="BNB-ETH">BNB-ETH</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Status" >
            {form.getFieldDecorator('status', {
              initialValue:filters.status || 'ALL',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{width:'120px'}}
                  placeholder="Search/Select"
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="ALL">All</Select.Option>
                  <Select.Option value="ORDER_OPENED">Opened</Select.Option>
                  <Select.Option value="ORDER_FINISHED">Completed</Select.Option>
                  <Select.Option value="ORDER_CANCELED">Cancelled</Select.Option>
                  <Select.Option value="ORDER_EXPIRE">Expired</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Side" >
            {form.getFieldDecorator('side', {
              initialValue:filters.side || 'all',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="sell">Sell</Radio.Button>
                <Radio.Button value="buy">Buy</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
          {
            false &&
            <Form.Item>
              <Button onClick={handleReset} type="default">Reset</Button>
            </Form.Item>
          }

        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);


