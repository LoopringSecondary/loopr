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
        <Form layout="inline">
          <Form.Item>
            <Radio.Group defaultValue="all" >
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="Transfer">Transfer</Radio.Button>
              <Radio.Button value="Receive">Receive</Radio.Button>
              <Radio.Button value="Approve">Approve</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);

 
