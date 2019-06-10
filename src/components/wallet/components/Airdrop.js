import React from 'react';
import {Card, Icon, Tooltip, Button, Alert} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {toHex, toBig, toNumber,clearPrefix} from "Loopring/common/formatter";
import CoinIcon from '../../common/CoinIcon';
import {projects} from "../../../common/config/data";
import mapAsync from 'async/map';
import intl from 'react-intl-universal';
import {Page, Pages} from 'Loopr/Pages';
import AirdropBind from './AirdropBind'
import Notification from 'Loopr/Notification';
import request from 'Loopring/common/request'
import moment from 'moment'


const method = '51c108776974686472617767f7c5643ab1896195b8abe8cfd2e3b450441ca45c00000000000000000120f7c5643ab1896195b8abe8cfd2e3b450441ca45c0000010600043032313500'
const neohost = '//relay1.loopr.io/neo';

class Airdrop extends React.Component {
  state = {
    projects
  };

  endianChange = (inSmall) => {
    let result = [], num;
    if (inSmall.indexOf("0x") === 0) {
      inSmall = inSmall.slice(2);
    } else if (inSmall) {
      result = ['0x'];
    }
    let smaArray = inSmall.hexToBytes().reverse();
    for (let i = 0; i < smaArray.length; i++) {
      num = smaArray[i];
      if (num < 16) {
        num = smaArray[i].toString(16);
        num = "0" + num;
      } else {
        num = smaArray[i].toString(16);
      }
      result.push(num);
    }
    return result.join("");
  }

  getScriptHash = async (address) => {
    const hash = await window.AntShares.Wallets.Wallet.toScriptHash(address);
    if (address && address.length === 34 && hash) {
      return this.endianChange('0x' + hash.toString());
    } else {
      Notification.open({type: 'warning', message: intl.get('wallet.valid_add')})
    }
  };

  id = () => {
    return moment().format('YYYYMMDDHHmm')
  };
  claimToken = async (project) => {
    const {projects} = this.state;

    if (project.projectId !== 1) {
      Notification.open({type: 'error', message: intl.get('wallet.not_open')});
      return;
    }

    if (project.last && (moment().valueOf() - project.last) <= 60000) {
      Notification.open({type: 'warning', message: intl.get('wallet.claim_too_often')})
      return;
    }

    if (!(project.amount && project.amount > 0)) {
      Notification.open({type: 'warning', message: intl.get('wallet.claim_value_low')})
      return
    }
    const address = project.address;
    const scriptHash = await this.getScriptHash(address);
    if (scriptHash) {
      const params = 'd1013d1c' + this.id() + '0000' + scriptHash + method;
      let body = {};
      body.method = 'sendrawtransaction';
      body.params = [params];
      const res = await request({method: 'post', body}, neohost);
      if (res.result) {
        Notification.open({
          message: intl.get('wallet.claim_token_suc', {token: project.lrx}),
          type: 'success',
          actions: (
            <div>
              <Button className="alert-btn mr5"
                      onClick={() => window.open(`https://neotracker.io/tx/${clearPrefix(res.result.txid)}`, '_blank')}>{intl.get('wallet.neo_bro')}</Button>
            </div>
          )
        });
        const index = projects.indexOf(project)
        project.last = moment().valueOf();
        projects[index] = project;
        Notification.open({type: 'success', message: '领取成功'});
        this.setState({projects})
      } else {
        Notification.open({
          type: 'error',
          message: intl.get('wallet.claim_token_fail', {token: project.lrx}),
          description: res.error.message
        })
      }
    }
  };

  componentDidMount() {
    const _this = this;
    mapAsync(projects, async (project, callback) => {
      try {
        let address = await getBindAddress(window.WALLET.getAddress(), project.projectId);
        if (project.projectId === 1) {
          project.claimable = false;
          project.valid = false;
          const scriptHash = await this.getScriptHash(address);
          if (scriptHash) {
            project.valid = true;
            const params = '14' + scriptHash + '51c1157175657279417661696c61626c6542616c616e636567f7c5643ab1896195b8abe8cfd2e3b450441ca45c';
            let body = {};
            body.method = 'invokescript';
            body.params = [params];
            const res = await request({method: 'post', body}, neohost);
            if (res.result) {
              project.amount = toNumber(toBig(res.result.stack[0].value).div(1e8));
              project.claimable = true
            }
          }
        } else if (address) {
          project.valid = true;
          project.claimable = false
        }
        callback(null, {...project, address})
      } catch (e) {
        callback(e)
      }
    }, (err, results) => {
      if (!err) {
        _this.setState({projects: results});
      }
    })
  }

  findBindAddress = (project) => {
    const targetProject = this.state.projects.find(pro => pro.projectId === project.projectId);
    return targetProject ? targetProject.address : '';
  };

  render() {
    const {projects} = this.state;
    const neoProject = projects.find(item => item.projectId === 1);
    const HomePage = ({page}) => {
      return (
        <Card title={intl.get('wallet.airdrop')}>
          {neoProject.claimable && <Alert type="success" className="mb10"
                                          description={
                                            <div>
                                              {intl.get('wallet.cur_claim', {
                                                token: neoProject.lrx,
                                                amount: neoProject.amount
                                              })},
                                              <a className='color-blue-500 ml5'
                                                 onClick={() => this.claimToken(neoProject)}>{intl.get('wallet.claim_action', {token: neoProject.lrx})}</a>
                                            </div>
                                          }/>}
          {this.state.projects.map((project, index) => {
            return (<div className="row zb-b-b pt10 pb10 ml0 mr0 align-items-center" key={index}>
              <div className="col-auto pl0">
                <CoinIcon size="32" color="grey-900"/>
              </div>
              <div className="col pl0 pr0">
                <div className="fs2 color-black-1 font-weight-bold list-inline ">
                  <div className='list-inline-item'>
                    {project.lrx.toUpperCase()}
                  </div>
                  {this.findBindAddress(project) &&
                  <div className='list-inline-item'>
                    <Tooltip title={intl.get('wallet.binding')}>
                      <span>
                        <Icon type="check-circle" className="color-success-1"/>
                      </span>
                    </Tooltip>
                  </div>
                  }
                  {this.findBindAddress(project) && !project.valid &&
                  <div className='fs3 color-black-1 color-error-1 list-inline-item'>
                    {intl.get('wallet.invalid_bind_add', {token: project.lrc})}
                  </div>
                  }
                </div>
                {!this.findBindAddress(project) &&
                <div className="fs2 color-black-3 pl0 pr0">
                  {intl.get('wallet.no_bound')}
                </div>
                }
                {this.findBindAddress(project) &&
                <div className='fs3 color-black-3'>
                  <Tooltip
                    title={intl.get('wallet.bound_address', {token: intl.get(`wallet.${project.name.toLowerCase()}`)})}>
                    {this.findBindAddress(project)}
                  </Tooltip>
                </div>
                }
              </div>
              {false && project.claimable && <div className="col-auto pl0 pr5">
                <div className="f2 ">
                  <a className="color-primary-1"
                     onClick={() => this.claimToken(project)}>{project.amount} {intl.get('wallet.to_claim', {token: project.lrx})}</a>
                </div>
              </div>
              }
              {!this.findBindAddress(project) && <div className="col-auto pr5">
                <div className="f2 color-black-3">
                  <a className="color-primary-1"
                     onClick={page.gotoPage.bind(this, {
                       id: "detail",
                       project: project,
                       onClose: page.gotoPage.bind(this, {id: 'list'})
                     })}>{intl.get('wallet.to_bind_address')}</a>
                </div>
              </div>
              }
              {this.findBindAddress(project) && <div className="col-auto pl0 pr5">
                <div className="f2 ">
                  <a className="color-primary-1"
                     onClick={page.gotoPage.bind(this, {
                       id: "detail",
                       project: project,
                       onClose: page.gotoPage.bind(this, {id: 'list'})
                     })}>{intl.get('wallet.to_edit')}</a>
                </div>
              </div>
              }
              <div className="col-auto pr0 pl0">
                <div className="f2 color-black-3">
                  <i className="icon-loopring icon-loopring-right"/>
                </div>
              </div>
            </div>)
          })}
          <div className="mb25"></div>
        </Card>)
    };
    return (
      <Pages active='list'>
        <Page id='list'>
          <HomePage/>
        </Page>
        <Page id="detail">
          <AirdropBind/>
        </Page>
      </Pages>
    );
  }
}

export default Airdrop
