import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input } from 'antd';
import schema from '../../../../modules/tokens/schema';
import tokens from './tokens';

function ListBlock({LIST,actions}) {
  const {
      // items=[],
      loading,
      page={}
  } = LIST
  const items = tokens
  
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
            <Button icon="star-o" shape="circle"></Button>
          </Tooltip>
        </div>
        <div className="col-auto">
          <Tooltip title="Hide 0 Balances">
            <Button icon="eye-o" shape="circle"></Button>
          </Tooltip>
        </div>
      </div>
      {
        items.map((item,index)=>
          <div className="row align-items-center no-gutters zb-b-b pt10 pb10" key={index}>
            <div className="col-auto pr10">
              <Icon type="star-o" />
            </div>
            <div className="col-auto pr10">
              <Avatar src={item.logo} size="large" className="bg-white border border-grey-300 p5" />
            </div>
            <div className="col pr10">
              <div className="">
                <span className="fs18 color-grey-900">{item.token}</span>
                <span className="fs12 ml5 color-grey-400">{item.title}</span>
              </div>
              <div className="">
                <span className="fs14 color-grey-900">0.00</span>
                <span className="fs12 ml5 color-grey-400">$ 0.00</span>
              </div>
            </div>
            <div className="col"></div>
            <div className="col-auto">
              <Tooltip title="Some Tips To Say">
                <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked />
              </Tooltip>
            </div>
            <div className="col-auto">
              
            </div>
          </div>
        )
      }
    </div>
  )
}


export default ListBlock

{
/*<List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
        />
*/}
