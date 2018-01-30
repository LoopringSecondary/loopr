import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,Checkbox} from 'antd';

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
          <Form.Item label="Token">
            <Select
                showSearch
                style={{ width: 150 }}
                placeholder=""
                optionFilterProp="children"
                onChange={()=>{}}
                onFocus={()=>{}}
                onBlur={()=>{}}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option value="LRC">LRC</Select.Option>
                <Select.Option value="USDT">USDT</Select.Option>
                <Select.Option value="BNB">BNB</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item>
            <Checkbox>Show My Favorite Only</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Hide 0 Balance</Checkbox>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
