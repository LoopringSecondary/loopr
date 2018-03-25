import React from 'react';
import {Button, Card, Form, Input, message, Modal, Select,Badge} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {connect} from 'dva';
import {projects} from "../../../common/config/data";
import {toHex} from "Loopring/common/formatter";
import intl from 'react-intl-universal';
import mapAsync from 'async/map';
import CoinIcon from '../../common/CoinIcon';

class Airdrop extends React.Component {
  render() {
    const {modal} = this.props
    return (
      <Card title="Airdrop">
        <div className="row zb-b-b pt10 pb10 ml0 mr0 align-items-center">
          <div className="col-auto pl0">
            <CoinIcon size="32" color="grey-900" />
          </div>
          <div className="col pl0 pr0">
            <div className="fs2 color-black-1 font-weight-bold">
              LRN
            </div>
            <div className="fs2 color-black-3 pl0 pr0">
              Loopring On NEO
            </div>
          </div>
          <div className="col-auto pr5">
            <div className="f2 color-black-3">
              <a href="">Bind Address</a>
            </div>
          </div>
          <div className="col-auto pr0 pl0">
            <div className="f2 color-black-3">
              <i className="icon-loopring icon-loopring-right"></i>
            </div>
          </div>
        </div>
        <div className="row zb-b-b pt10 pb10 ml0 mr0 align-items-center">
          <div className="col-auto pl0">
            <CoinIcon size="32" color="grey-900" />
          </div>
          <div className="col pl0 pr0">
            <div className="fs2 color-black-1 font-weight-bold">
              LRQ
              <Badge className="ml5" count={"Binded"} style={{ backgroundColor: '#52c41a' }} />
            </div>
            <div className="fs2 color-black-3 pl0 pr0">
              Loopring On QTUM
            </div>
          </div>
          <div className="col-auto pl0 pr5">
            <div className="f2 ">
              <a href="" onClick="">Edit Address</a>
            </div>
          </div>
          <div className="col-auto pr0 pl0">
            <div className="f2 color-black-3">
              <i className="icon-loopring icon-loopring-right"></i>
            </div>
          </div>
        </div>
        <div className="mb25"></div>
      </Card>
    );
  }
}


export default Airdrop

