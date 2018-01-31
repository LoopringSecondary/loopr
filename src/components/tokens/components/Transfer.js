import React from 'react';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Card} from 'antd';

let Transfer = ({
  form,
  modals,
  }) => {
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
        modals.hideModal({id:'token/transfer'})
        modals.showModal({id:'token/transfer/preview'})
      }
    });
  }
  function handleCancle() {
    modals.hideModal({id:'transfer'})
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    // if(modal.state && modal['transfer']){
    //   const values = form.getFieldsValue()
    //   const transfer = modal.state['transfer'].data
    //   if(transfer.token && values['token'] != transfer['token'] ){
    //     form.resetFields()
    //   }
    // }
  }
  resetForm()
  const formImemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  }
  return (
      <Card title="Send LRC">
        <Form layout="horizontal">
          <Form.Item label="Recipient" {...formImemLayout}>
            {form.getFieldDecorator('to', {
              initialValue:'',
              rules:[]
            })(
              <Input placeholder="" size="large" />
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formImemLayout}>
            {form.getFieldDecorator('amount', {
              initialValue:0,
              rules:[]
            })(
              <Input className="d-block w-100" placeholder="" size="large" />
            )}
          </Form.Item>
          <Collapse accordion bordered={false} defaultActiveKey={['advanced']}>
            <Collapse.Panel className="" style={{border:'none',margin:'0px -15px',padding:'0px -15px'}} 
              header={<div>Transaction Fee</div>} 
              key="advanced"
              showArrow={false}
            >
              <Form.Item className="mb0" label={null && "Transaction Fee"}>
                {form.getFieldDecorator('transactionFee', {
                  initialValue:8400,
                  rules:[]
                })(
                  <Slider min={2100} max={21000} step={2100} 
                    marks={{
                      2100: 'slow',
                      8400: '8400',
                      21000: 'fast'
                    }} 
                  />
                )}
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel className="" 
              style={{border:'none',margin:'0px -15px',padding:'0px -15px'}} 
              header={<div>Advanced</div>} 
              key="2"
            >
              <Form.Item label="Data" {...formImemLayout}>
                {form.getFieldDecorator('data', {
                  initialValue:0,
                  rules:[]
                })(
                  <Input className="d-block w-100" placeholder="" size="large" />
                )}
              </Form.Item>
              <Form.Item label="Gas Limit" {...formImemLayout}>
                {form.getFieldDecorator('gasLimit', {
                  initialValue:0,
                  rules:[]
                })(
                  <Input className="d-block w-100" placeholder="" size="large" />
                )}
              </Form.Item>
              <Form.Item label="GasPrice">
                {form.getFieldDecorator('gasPrice', {
                  initialValue:8400,
                  rules:[]
                })(
                  <Slider min={2100} max={21000} step={2100} 
                    marks={{
                      2100: 'slow',
                      8400: '8400',
                      21000: 'fast'
                    }} 
                  />
                )}
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
          
          <Form.Item >
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </Card>
  );
};


export default Form.create()(Transfer);

 
