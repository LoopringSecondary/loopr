import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover } from 'antd';
import schema from '../../../../modules/tokens/schema';
import tokens from './tokens';

function ListBlock({LIST,actions,modal}) {
  const {
      // items=[],
      loading,
      page={}
  } = LIST
  const items = tokens
  const actionsCard = (
    <div style={{width:'150px'}}>
      <div className="row no-gutters">
        <div className="col-12 p5">
          <Button onClick={modal.showModal.bind(this,'transfer')} className="w-100 " type="primary" icon="pay-circle-o">Transfer</Button>
        </div>
        <div className="col-12 p5">
          <Button onClick={modal.showModal.bind(this,'receive')} className="w-100 " type="primary" icon="qrcode">Receive</Button>
        </div>
        <div className="col-12 p5">
          <Button onClick={modal.showModal.bind(this,'approve')} className="w-100 " type="primary" icon="safety">Approve</Button>
        </div>
        <div className="col-12 p5">
          <Button className="w-100 " type="primary" icon="retweet">Convert</Button>
        </div>
        <div className="col-12 p5">
          <Button className="w-100 " type="primary">
            <i className="fa fa-line-chart mr5"></i>Trade
          </Button>
        </div>

      </div>
    </div>
  )
  return (
    <div className="">
      <div className="row zb-b-b pb10 no-gutters">
        <div className="col mr5">
          <Input
            placeholder=""
            prefix={<Icon type="search" className="color-grey-600"/>}
            className="d-block w-100"
          />
        </div>
        <div className="col-auto mr5">
          <Tooltip title="Only Show My Favorites">
            <Button className="color-grey-600" icon="star-o" shape="circle"></Button>
          </Tooltip>
        </div>
        <div className="col-auto mr5">
          <Tooltip title="Hide 0 Balances">
            <Button className="color-grey-600" icon="eye-o" shape="circle"></Button>
          </Tooltip>
        </div>
        <div className="col-auto">
          <Tooltip title="">
            <Popover
              title="Sort"
              placement="bottom"
              arrowPointAtCenter
              content={
                <div>
                  <div className="fs12 pb10 zb-b-b">Sort By Name</div>
                  <div className="fs12 pt10 pb10 zb-b-b">Sort By Balance</div>
                  <div className="fs12 pt10 ">Sort By Amount</div>
                </div>
              }
            >
              <Button className="color-grey-600" shape="circle">
                <i className="fa fa-sort"></i>
              </Button>
            </Popover>
          </Tooltip>

        </div>
      </div>
      {
        items.map((item,index)=>
          <div className="row align-items-center no-gutters flex-nowrap zb-b-b pt10 pb10" key={index}>
            <div className="col-auto pr10">
              {
                index <=4 &&
                <Icon type="star" className="color-blue-600" />
              }
              {
                index >4 &&
                <Icon type="star" className="color-grey-300" />
              }
            </div>
            <div className="col-auto pr10">
              <Avatar src={item.logo} size="" className="bg-white border border-grey-300 p5" />
            </div>
            <div className="col pr10">
              <div className="">
                <span className="fs18 color-grey-900">{item.token}</span>
                <span className="fs12 ml5 color-grey-400 text-truncate text-nowrap" style={{maxWidth:'65px'}}>{item.title}</span>
              </div>
              <div className="">
                <span className="fs14 color-grey-900">0.00</span>
                <span className="fs12 ml5 color-grey-400">$ 0.00</span>
              </div>
            </div>
            <div className="col"></div>
            <div className="col-auto mr5">
              <Tooltip title="Some Tips To Say">
                <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked={index<=3} />
              </Tooltip>
            </div>
            <div className="col-auto">
              <Popover
                title="Actions"
                placement="right"
                arrowPointAtCenter
                content={actionsCard}
              >
                <Button shape="circle">
                  <Icon type="ellipsis" />
                </Button>
              </Popover>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ListBlock

