import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,DatePicker} from 'antd';

let FiltersForm = ({
  actions,
  form,
  }) => {
  function handleSubmit() {
  }
  function handleCancle() {
  }
  function handleReset() {
  }
  return (
      <div>
        <div className="emp15"></div>
        <Form layout="inline">
          <Form.Item label="Token">
            <Select
                showSeach={true}
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="LRC">LRC</Select.Option>
                <Select.Option value="ETH">ETH</Select.Option>
                <Select.Option value="BTC">BTC</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item label="Type">
            <Select
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="Transfer">Transfer</Select.Option>
                <Select.Option value="Receive">Receive</Select.Option>
                <Select.Option value="Convert">Convert</Select.Option>
                <Select.Option value="Approve">Approve</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item label="Time">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
