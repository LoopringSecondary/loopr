import React from 'react';
import {Button, Card, Input, Progress,Form,Select} from 'antd';


export default class BindAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handelSubmit() {

  }
  render() {
    return (
      <Card title='Bind Address For Airdrop'>
        <Form>
          <Form.Item label="Bind Type">
            <Select
              size="large"
              placeholder="Select Token To Bind"
            >
              <Select.Option value="LRN">LRN ( for neo )</Select.Option>
              <Select.Option value="LRQ">LRQ ( for qtum)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Your ETH Address">
            <Input.TextArea
              size="large"
              autoSize={true}
              placeholder="Paste You ETH Address With LRC"
            />
          </Form.Item>
        </Form>
        <div className="mb25"></div>
        <Button onClick={this.handelSubmit.bind(this)}
                className="w-100 d-block mt15" type="primary" size="large">
          Bind Address
        </Button>
      </Card>
    );
  }
}

