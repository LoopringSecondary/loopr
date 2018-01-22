import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse} from 'antd';

let TradeForm = ({
  form,
  side='sell',
  }) => {
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleCancle() {
  }
  function handleReset() {
    form.resetFields()
  }
  return (
      <div>
        <Form layout="horizontal">
          <Form.Item >
            <div className="fs18 color-grey-900">{side.toUpperCase()} LRC</div>
          </Form.Item>
          <Form.Item label="Amount">
            {form.getFieldDecorator('amount', {
              initialValue:'',
              rules:[]
            })(
              <Input placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item label="Price">
            {form.getFieldDecorator('price', {
              initialValue:0,
              rules:[]
            })(
              <Input className="d-block w-100" placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item label="Total">
            {form.getFieldDecorator('total', {
              initialValue:0,
              rules:[]
            })(
              <Input disabled className="d-block w-100" placeholder="" size="large" />
            )}
          </Form.Item>
          <Collapse bordered={false} defaultActiveKey={[]}>
            <Collapse.Panel className="" style={{border:'none',margin:'0px -15px',padding:'0px -15px'}} header={<div style={{}}>Advanced</div>} key="1">
              <div className="row">
                <div className="col-12">
                  <Form.Item label="Time to live">
                    {form.getFieldDecorator('time', {
                      initialValue:0,
                      rules:[]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" />
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item label="Lrc Fee">
                    {form.getFieldDecorator('lrcFee', {
                      initialValue:0,
                      rules:[]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" />
                    )}
                  </Form.Item>
                </div>

                <div className="col">
                  <Form.Item label="MarginSplit">
                    {form.getFieldDecorator('marginSplit', {
                      initialValue:0,
                      rules:[]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" />
                    )}
                  </Form.Item>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>

          <Form.Item >
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Place Order</Button>
          </Form.Item>

          
        </Form>
      </div>
  );
};


export default Form.create()(TradeForm);

 
