import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover,Select, } from 'antd';
import schema from '../../../modules/transactions/schema';
import ListFiltersFormSimple from './ListFiltersFormSimple'
import iconTransfer from '../../../assets/images/icon-tx-type-transfer.png'
import iconReceive from '../../../assets/images/icon-tx-type-receive.png'
import iconTrade from '../../../assets/images/icon-tx-type-trade.png'

function ListBlock({LIST,actions}) {
  const {
      items=[],
      loading,
      page={}
  } = LIST

  const TransferTx = ({item,index})=>{
    return (
      <div className="row align-items-center no-gutters flex-nowrap zb-b-b p20" key={index}>
        <div className="col-auto">
          <div className="text-left" style={{width:'85px'}}>
            { index%3 == 0 && <Badge status="warning" text="Pending" /> }
            { index%3 == 1 && <Badge status="success" text="Success" /> }
            { index%3 == 2 && <Badge status="error" text="Failed" /> }
          </div>
        </div>
        <div className="col-auto pr15">
          <div className="text-center">
            { index%3 == 0 && <img src={iconTransfer} alt="" style={{width:'30px'}} /> }
            { index%3 == 1 && <img src={iconReceive} alt="" style={{width:'30px'}} /> }
            { index%3 == 2 && <img src={iconTrade} alt="" style={{width:'30px'}} /> }
            <div className="fs12 mt5" hidden>Transfer</div>
          </div>
        </div>
        <div className="col pr10">
          <div className="">
            <div className="fs20 color-grey-900 mb5">Sent LRC</div>
            <div className="fs14  color-grey-400 text-nowrap text-truncate">
              From 0xeae8bd296df8e90e63b14021640652045ee84d5b
            </div>
            <div className="fs14  color-grey-400 text-nowrap text-truncate">
              At 2018-01-20 10:00:00
            </div>
          </div>
        </div>
        <div className="col"></div>
        <div className="col-auto mr5">
          { index%2 == 0 && 
            <div className="text-right">
              <div className="fs20 color-green-500 mb10">+ 3456.78 LRC</div>
              <div className="fs16 color-green-500">+ $ 34567.8</div>
            </div>
          }
          { index%2 == 1 && 
            <div className="text-right">
              <div className="fs20 color-red-500 mb10">- 3456.78 LRC</div>
              <div className="fs16 color-red-500">- $ 34567.8</div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="row zb-b-b p15 no-gutters align-items-center">
        <div className="col">
          <div className="fs20 color-grey-900">Transactions</div>
        </div>
        <div className="col-auto" style={{height:'32px'}}>
            <ListFiltersFormSimple actions={actions} LIST={LIST} />
        </div>
      </div>
      {
        items.map((item,index)=>
          <TransferTx item={item} index={index} />
        )
      }
    </div>
  )
}

export default ListBlock
