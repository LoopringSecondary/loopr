import React from 'react';
import { Col,Form,InputNumber,Button,Icon,Modal,Input,Radio,Switch,Select,Checkbox,Slider,Collapse,Card} from 'antd';
import validator from '../../../common/Loopring/common/validator'

class Transfer extends React.Component {
  state = {
    gas: 200000000,
    advanced: false,
    value: 0
  }

  render() {
    const {form, modal} = this.props
    //{symbol: "BNB", balance: "0.00", allowance: "0", logo: "", title: "Binance"}
    const selectedToken = modal.item || {}
    //const selectedToken = tokens.items.find(item => item.symbol === tokens.selected)
    function handleSubmit() {
      form.validateFields((err, values) => {
        console.log('values', values);
        if (!err) {
          // TODO
          modal.hideModal({id: 'token/transfer'})
          modal.showModal({id: 'token/transfer/preview'})
        }
      });
    }

    function handleCancle() {
      modal.hideModal({id: 'transfer'})
    }

    function handleReset() {
      form.resetFields()
    }

    function resetForm() {
      // if(modal.state && modal['transfer']){
      //   const values = form.getFieldsValue()
      //   const transfer = modal.state['transfer'].data
      //   if(transfer.token && values['token'] != transfer['token'] ){
      //     form.resetFields()
      //   }
      // }
    }

    function setAdvance(v) {
      this.setState({advanced:v})
    }

    function setGas(v) {
      this.setState({gas:v})
    }

    function selectMax(e) {
      e.preventDefault();
      this.setState({value: selectedToken.balance})
    }

    async function validateEthAddress(value) {
      console.log(validator.validate({value: value, type: 'ADDRESS'}))
      try {
        await validator.validate({value: value, type: 'ADDRESS'})
        return true;
      } catch (e) {
        return false;
      }
    }

    resetForm()
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    }
    const formatGas = (value) => {
      return (value / 100000000000) + " ether";
    }
    return (
      <Card title={"Send "+selectedToken.symbol}>
        <Form layout="horizontal">
          <Form.Item label="Recipient" {...formItemLayout} colon={false}>
            {this.props.form.getFieldDecorator('to', {
              initialValue: '',
              rules: [
                {required: true, message: 'Invalid Ethereum address',
                  validator: (rule, value, cb) => validateEthAddress(value) ? cb() : cb(true)
                }
              ]
            })(
              <Input placeholder="" size="large"/>
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col-auto">≈USD 123</div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={selectMax.bind(this)}>Send Max</a></div>
            </div>
          }>
            {this.props.form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [
                {required: true, message: 'Invalid Ethereum address',
                  validator: (rule, value, cb) => validateEthAddress(value) ? cb() : cb(true)
                }
              ]
            })(
              <InputNumber className="d-block w-100" placeholder="" size="large" min={1} max={10} value={this.state.value}/>
            )}
          </Form.Item>

          {!this.state.advanced &&
            <div>
              <div style={{height:"253px"}}>
                <Form.Item className="mb0" label={"Transaction Fee: "+formatGas(this.state.gas)} colon={false}>
                  {this.props.form.getFieldDecorator('gasFee', {
                    initialValue: this.state.gas,
                    rules: []
                  })(
                    <Slider min={20000000} max={300000000} step={1}
                            marks={{
                              20000000: 'slow',
                              300000000: 'fast'
                            }}
                            tipFormatter={formatGas}
                            onChange={setGas.bind(this)}
                    />
                  )}
                </Form.Item>
              </div>
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label="Advance" colon={false}>
                    {this.props.form.getFieldDecorator('advance', {
                      initialValue: 8400,
                      rules: []
                    })(
                      <Switch onChange={setAdvance.bind(this)}/>
                    )}
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          {this.state.advanced &&
            <div>
              <Form.Item label="Data" {...formItemLayout} colon={false}>
                {this.props.form.getFieldDecorator('data', {
                  initialValue: 0,
                  rules: []
                })(
                  <Input className="d-block w-100" placeholder="" size="large"/>
                )}
              </Form.Item>
              <Form.Item label="Gas Limit" {...formItemLayout} colon={false}>
                {this.props.form.getFieldDecorator('gasLimit', {
                  initialValue: 0,
                  rules: []
                })(
                  <Input className="d-block w-100" placeholder="" size="large"/>
                )}
              </Form.Item>
              <Form.Item label="GasPrice" colon={false}>
                {this.props.form.getFieldDecorator('gasPrice', {
                  initialValue: 8400,
                  rules: []
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
              <div className="row">
                <div className="col"></div>
                <div className="col-auto">
                  <Form.Item className="mb0 text-right d-flex align-items-center" label="Advance" colon={false}>
                    {this.props.form.getFieldDecorator('advance', {
                      initialValue: 8400,
                      rules: []
                    })(
                      <Switch defaultChecked onChange={setAdvance.bind(this)}/>
                    )}
                  </Form.Item>
                </div>
              </div>
            </div>
          }
          <Form.Item>
            <Button onClick={handleSubmit} type="primary" className="d-block w-100" size="large">Continue</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
};


export default Form.create()(Transfer);


