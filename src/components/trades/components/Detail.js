import React from 'react';
import {Link} from 'dva/router';
import {Button, Card, ListItem} from 'antd';
import {getRings} from 'Loopring/relay/ring'
import {toNumber} from "Loopring/common/formatter";


const MetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row pt10 pb10 zb-b-b">
      <div className="col">
        <div className="fs14 color-grey-600">{label}</div>
      </div>
      <div className="col-8 text-right">
        <div className="fs12 color-grey-900 text-wrap">{value}</div>
      </div>
    </div>
  )
}

class DetailBlock extends React.Component {

  state={
    ring:null
  };
  componentDidMount() {
    const {settings, modal} = this.props;
    const _this = this;
    getRings({ringHash: modal.item.ringHash, contractVersion: settings.trading.contract.version}).then(res => {
      if (!res.error) {
        const rings = res.result.data;
        if (rings.length > 0) {
          _this.setState({ring: rings[0]});
          console.log('Ring',_this.state.ring)
        }
      }
    })
  }

  render() {
    const {ring} = this.state;

    return (
      <div className="">
        {!ring && "Can't get this ring from relay"}
        { false &&<Card title="Ring Infomation" loading={false}>
          <MetaItem label="RingHash" value={ring.ringHash}/>
          <MetaItem label="Miner" value={ring.miner}/>
          <MetaItem label="txHash" value={ring.txHash}/>
          <MetaItem label="BlockNumber" value={ring.blockNumber}/>
          <MetaItem label="FeeRecepient" value={ring.feeRecepient}/>
          <MetaItem label="totalLrcFee" value={ring.totalLrcFee}/>
          <MetaItem label="timestamp" value={window.uiFormatter.getFormatTime(toNumber(ring.timeStamp)*1e3)}/>
          <div className="mb30"></div>
          <Button type="default" className="d-block w-100" size="large"> More Detail About Ring, Goto Ringinfo</Button>
        </Card>
        }
      </div>
    );


  }


}

export default DetailBlock;
