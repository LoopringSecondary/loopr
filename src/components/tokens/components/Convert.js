import React from 'react';
import { Form,Avatar,Input,Button,Card} from 'antd';
import ethLogo from '../../../assets/images/eth.png';
import wethLogo from '../../../assets/images/weth.png';
import wrapArrow from '../../../assets/images/wrap-arrow.png';

let Convert = ({form}) => {
	function handleSubmit() {
	  form.validateFields((err,values) => {
	    console.log('values',values);
	    if(!err){
	      // TODO
	    }
	  });
	}
	const formImemLayout = {
	  labelCol: { span: 7 },
	  wrapperCol: { span: 17 },
	}
  return (
      <Card title="Convert">
        <div className="row justify-content-center align-items-center mb15">
        	<div className="col text-center">
        		<img className="rounded-circle" src={ethLogo} style={{height:'60px'}} />
        	</div>
        	<div className="col-auto">
        		<img src={wrapArrow} alt="" style={{height:'14px'}} />
        	</div>
        	<div className="col text-center">
        		<img className="rounded-circle" src={wethLogo} style={{height:'60px'}} />
        	</div>
        </div>
        <Form layout="horizontal">
        	<div className="row align-items-center justify-content-center">
        		<div className="col">
        			<Form.Item className="mb0">
        			  {form.getFieldDecorator('eth_amount', {
        			    initialValue:'',
        			    rules:[]
        			  })(
        			    <Input placeholder="" size="large" addonAfter="ETH" />
        			  )}
        			</Form.Item>
        		</div>
        		<div className="col-auto"> <div>=</div> </div>
        		<div className="col">
        			<Form.Item className="mb0">
        			  {form.getFieldDecorator('weth_amount', {
        			    initialValue:'',
        			    rules:[]
        			  })(
        			    <Input placeholder="" size="large" addonAfter="WETH" />
        			  )}
        			</Form.Item>
        		</div>
        	</div>
          
          <Form.Item className="mb0 mt15">
          	<div className="fs12 color-grey-500 text-center mb5">
          		0.1 ETH is researved as gas so that you can send transactions.
          	</div>
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Yes,Wrap Now!</Button>
          </Form.Item>
        </Form>
      </Card>
  );
};

export default Form.create()(Convert);

 
