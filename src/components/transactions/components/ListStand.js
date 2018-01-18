import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover,Select, } from 'antd';
import schema from '../../../modules/transactions/schema';
import ListFiltersFormSimple from './ListFiltersFormSimple'

function ListBlock({LIST,actions}) {
  const {
      items=[],
      loading,
      page={}
  } = LIST
  
  return (
    <div className="">
      <div className="row zb-b-b pb10 no-gutters">
        <div className="col">
          <div className="fs20 color-grey-900">Transactions</div>
        </div>
        <div className="col-auto">
            <ListFiltersFormSimple actions={actions} LIST={LIST} />
        </div>
      </div>
      {
        items.map((item,index)=>
          <div className="row align-items-center no-gutters flex-nowrap zb-b-b pt20 pb20" key={index}>
            <div className="col-auto pr15">
              <div className="text-center">
                <Avatar size="large" className="bg-blue-600" />
                <div hidden>Transfer</div>
              </div>
            </div>
            <div className="col pr10">
              <div className="">
                <div className="fs20 color-grey-900 mb5">Sent / Received LRC</div>
                <div className="fs16  color-grey-400 text-nowrap text-truncate mb5">
                  From 0xeae8bd296df8e90e63b14021640652045ee84d5b
                </div>
                <div className="fs16  color-grey-400 text-nowrap text-truncate">
                  At 2018-01-20 10:00:00
                </div>

              </div>
            </div>
            <div className="col"></div>
            <div className="col-auto mr5">
              <div className="text-right">
                <div className="fs20 color-grey-900 mb10">+ 3456.78 LRC</div>
                <div className="fs16 color-grey-400">+ $ 34567.8</div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ListBlock
