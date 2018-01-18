import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table,Badge,Button,List,Avatar } from 'antd';
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
      {
        false &&
        <List
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
      }
      {
        items.map((item,index)=>
          <div className="row" key={index}>
            <div className="col-auto">{item.token}</div>
            <div className="col">{item.balance}</div>
            <div className="col-auto"></div>
          </div>
        )
      }
    </div>
  )
}

ListBlock.propTypes = {
};

export default ListBlock
