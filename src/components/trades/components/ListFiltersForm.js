import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';

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
        <Form layout="inline">
          <Form.Item label="Market">
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search"
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="jack">LRC/ETH</Select.Option>
                <Select.Option value="lucy">USDT/ETH</Select.Option>
                <Select.Option value="tom">BNB/ETH</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item label="Side">
            <Radio.Group defaultValue="all" >
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="horizontal">Sell</Radio.Button>
              <Radio.Button value="vertical">Buy</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="default">Reset</Button>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
