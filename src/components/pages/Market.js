import React from 'react';
import { Icon,Popover,Tabs,Card } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/pages'
import Token from '../tokens/pages'
import Transaction from '../transactions/pages'
import Ring from '../rings/pages'
import SellForm from './SellForm'

const MarketList = (props)=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  return (
    <Tabs defaultActiveKey="Favorites" animated={false} >
      <Tabs.TabPane tab={tab('Favorites')} key="Favorites">
       Favorites
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('ETH')} key="ETH">
       ETH
      </Tabs.TabPane>
    </Tabs>
  )
  
}

const MarketHeader = (props)=>{
  return (
    <Popover
      title={null}
      placement="bottomLeft"
      arrowPointAtCenter={false}
      content={
        <div className="zb-b" style={{width:'450px'}}>
          <MarketList />
        </div>
      }
    >
      <div className="row align-items-center">
        <div className="col-auto">
          <Icon type="star-o" />
        </div>
        <div className="col">
          <div className="fs18 color-grey-900">LRC/ETH</div>
          <div className="fs12 color-grey-400">Select Market <Icon className="" type="down" /></div>
        </div>
      </div>
    </Popover>
  )
}
const NumberCaption = (props)=>(
  <div className="">
    <div className="fs16 color-grey-900">
      0.00107934 ETH $ 1.200
    </div>
    <div className="fs12 color-grey-400">
      Latest Price
    </div>
  </div>
)

const numbers = [
  {title:'Latest Price',number:'',extra:''},
  {title:'24H Change',number:''},
  {title:'24H High',number:''},
  {title:'24H Low',number:''},
  {title:'24H Volume',number:''},
]
const ExchangeItem = (props)=>(
  <div className="row">
    <div className="col-auto">
      <div className="fs18 color-grey-900">0.0012 ETH</div>
      <div className="fs12 color-grey-400">Binance Reference Price</div>
    </div>
    <div className="col-auto">
      <div className="fs18 color-grey-900">+ 12%</div>
      <div className="fs12 color-grey-400">24H Change</div>
    </div>
    <div className="col-auto">
      <div className="fs18 color-grey-900">523,6.88 ETH</div>
      <div className="fs12 color-grey-400">24H Volume</div>
    </div>
  </div>
)

export default function Home(props){
  const { children } = props
  return (
   <div>
     <div className="row align-items-center zb-b pt15 pb15">
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <MarketHeader />
        </div>
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <div className="fs16 color-grey-900">
            0.00107934 ETH $ 1.200
          </div>
          <div className="fs12 color-grey-400">
            Latest Price
          </div>
        </div>
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <div className="fs16 color-grey-900">
           + 10%
          </div>
          <div className="fs12 color-grey-400">
            24H Change
          </div>
        </div>
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <div className="fs16 color-grey-900">
           0.00116918
          </div>
          <div className="fs12 color-grey-400">
            24H High
          </div>
        </div>
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <div className="fs16 color-grey-900">
           0.00089000
          </div>
          <div className="fs12 color-grey-400">
            24H High
          </div>
        </div>
        <div className="col-sm-6 col-lg-2 zb-b-r">
          <div className="fs16 color-grey-900">
           4,382.34 ETH
          </div>
          <div className="fs12 color-grey-400">
            24H Volume
          </div>
        </div>
     </div>

     <div className="row align-items-center zb-b pt15 pb15 mt15">
        <div className="col-sm-6 col-lg-4 zb-b-r">
          <ExchangeItem />
        </div>
        <div className="col-sm-6 col-lg-4 zb-b-r">
          <ExchangeItem />
        </div>
        <div className="col-sm-6 col-lg-4 zb-b-r">
          <ExchangeItem />
        </div>
     </div>
     <Card title="Trade">
      <div className="row justify-content-around">
        <div className="col-sm-4">
          <SellForm />
        </div>
        <div className="col-sm-4">
          <SellForm />
        </div>
      </div>
     </Card>
     <Card title="My Open Orders">
      <Order.List />
     </Card>


   </div>
  )
}