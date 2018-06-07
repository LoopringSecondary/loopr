import React from 'react';
import {Card, Icon, Tooltip} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {toHex} from "Loopring/common/formatter";
import CoinIcon from '../../common/CoinIcon';
import {projects} from "../../../common/config/data";
import mapAsync from 'async/map';
import intl from 'react-intl-universal';
import {Page, Pages} from 'Loopr/Pages';
import AirdropBind from './AirdropBind'
import Notification from 'Loopr/Notification';
import request from 'Loopring/common/request'



class Airdrop extends React.Component {
  state = {
    projects
  };

   endianChange = (inSmall) =>  {
    let result=[],num;
    if(inSmall.indexOf("0x")===0) {inSmall = inSmall.slice(2);
    }else if(inSmall){result = ['0x'];}
    let smaArray = inSmall.hexToBytes().reverse();
    for (let i = 0; i < smaArray.length; i++) {
      num = smaArray[i];
      if (num<16) {
        num = smaArray[i].toString(16);
        num="0"+num;
      }else {num = smaArray[i].toString(16);}
      result.push(num);
    }
    return result.join("");
  }

  claimToken = async (project) => {
    if (project.projectId === 1) {
      const address = this.findBindAddress(project);
      const hash = await window.AntShares.Wallets.Wallet.toScriptHash(address);
      if(address && address.length === 34 && hash){
        const scriptHash = this.endianChange('0x' + hash.toString());
        const params = '14' + scriptHash +'51c1157175657279417661696c61626c6542616c616e63656773031a8b41f8605a281e209249c3bc219522bc7b';
        let body = {};
        body.method = 'invokescript';
        body.params = [params];
        console.log('params',params);
        const res = await request({method: 'post', body},'https://10.137.104.98:10332');
        Notification.open({type:'error',message:res})
      }else{
        Notification.open({type:'warning',message:'请绑定合法的NEO地址'})
      }
    } else {
        Notification.open({type:'warning',message:'暂时还没有开放领取'})
    }
  };

  componentDidMount() {
    const _this = this;
    mapAsync(projects, async (project, callback) => {
      const address = await getBindAddress(window.WALLET.getAddress(), project.projectId);
      callback(null, {...project, address})
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
    const HomePage = ({page}) => {
      return (
        <Card title={intl.get('wallet.airdrop')}>
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
                     onClick={() => this.claimToken(project)}>{intl.get('wallet.to_claim',{token:project.lrx})}</a>
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

