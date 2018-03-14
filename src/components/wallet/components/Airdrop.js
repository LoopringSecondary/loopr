import React from 'react';
import {Button, Card, Input, Modal, Form, Select, message} from 'antd';
import {bindAddress} from "Loopring/ethereum/utils";
import {connect} from 'dva';
import {projects} from "../../../common/config/data";
import {toHex} from "Loopring/common/formatter";
import Layout from '../../../layout/Layout'

class Airdrop extends React.Component {

  state = {
    address: null,
    visible: false,
    project: null
  };

  props = {
    tradingConfig: null,
    account: null
  };
  hideModal = () => {
    this.setState({visible: false})
  };

  showModal = () => {
    const {account,} = this.props;
    if (!account.isUnlocked) {
      message.warning('Please unlock your wallet first');
      return;
    }
    this.setState({visible: true})
  };

  handelSubmit = () => {
    const {account, tradingConfig} = this.props;
    const {project, address} = this.state;
    bindAddress({
      projectId: project.projectId,
      address,
      to: "0xbf78b6e180ba2d1404c92fc546cbc9233f616c42",
      privateKey: account.privateKey,
      gasPrice: toHex(tradingConfig.gasPrice * 1e9),
      walletType: account.walletType
    }).then(response => {
      if (!response.error) {
        message.error(response.error.message)
      } else {
        message.info('bind success');
        this.setState({address: null, visible: false, project: null})
      }
    });
  };

  projectChange = (value) => {
    const project = window.CONFIG.getProjectById(value)
    if (project) {
      this.setState({project})
    } else {
      message.error('invalid type of project')
    }
  };
  addressChange = (e) => {
    this.setState({address: e.target.value})
  };

  render() {
    const options = projects.map(project => <Select.Option value={project.projectId}>{project.lrx.toUpperCase()} (
      for {project.name.toUpperCase()} )</Select.Option>)
    const {project, address} = this.state;
    return (
      <Layout {...this.props}>
        <div className="container mt50 mb50">
          <Card title='Bind Address For Airdrop'>
            <Form>
              <Form.Item label="Bind Type">
                <Select
                  showSearch
                  size="large"
                  placeholder="Select Token To Bind"
                  onChange={this.projectChange}
                  value={project && project.projectId}
                >
                  {options}
                </Select>
              </Form.Item>
              <Form.Item label="Address">
                <Input.TextArea
                  size="large"
                  autoSize={true}
                  placeholder="Paste corresponding address here"
                  onChange={this.addressChange}
                  value={address}
                />
              </Form.Item>
            </Form>
            <div className="mb25"></div>
            <Button onClick={this.showModal}
                    className="w-100 d-block mt15" type="primary" size="large" disabled={!project || !address}>
              Bind Address
            </Button>
            <Modal
              title={`Bind ${ project && project.name.toUpperCase()} Address`}
              visible={this.state.visible}
              onOk={this.handelSubmit}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
            >
              <p>token: {project && project.lrx.toUpperCase()}</p>
              <p>address:{address}</p>
            </Modal>
          </Card>
        </div>
      </Layout>

    );
  }
}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
    account: state.account
  };
}

export default connect(mapStateToProps)(Airdrop)

