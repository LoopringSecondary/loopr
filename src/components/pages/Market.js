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
  
  return (
    <table className="table table-sm table-striped">
      <tr className="">
        <th className="fs12 border-0 pl0"></th>
        <th className="fs12 border-0 ">Pair</th>
        <th className="fs12 border-0 ">Price</th>
        <th className="fs12 border-0 ">Change</th>
        <th className="fs12 border-0 ">Volume</th>
      </tr>
      {
        [1,1,1,1,1].map((item,index)=>
          <tr>
            <td className="fs12 border-0 pl0"><Icon type="star" /></td>
            <td className="fs12 border-0 ">LRC/ETH</td>
            <td className="fs12 border-0 color-green-600">0.00113489</td>
            <td className="fs12 border-0 color-green-600">+6.17%</td>
            <td className="fs12 border-0 ">6,767.31 ETH</td>
          </tr>
        )
      }
    </table>
  )
}

const MarketTabs = (props)=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  return (
    <Tabs defaultActiveKey="Favorites" animated={false} >
      <Tabs.TabPane tab={tab('Favorites')} key="Favorites">
       <MarketList />
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('ETH')} key="ETH">
       <MarketList />
      </Tabs.TabPane>
    </Tabs>
  )
}

const MarketHeader = (props)=>{
  return (
    <div className="row align-items-center">
      <div className="col-auto pr5 pl20">
        <Icon className="fs16 color-blue-600" type="star" />
      </div>
      <div className="col">
        <div className="fs18 color-grey-900">LRC/ETH</div>
        <Popover
          title={null}
          placement="bottomLeft"
          arrowPointAtCenter={false}
          content={
            <div className="" style={{width:'450px'}}>
              <MarketTabs />
            </div>
          }
        >
          <div className="fs12 color-grey-400">Select Market <Icon className="" type="down" /></div>  
        </Popover>
      </div>
    </div>
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
    <div className="row bg-white pt15 pb15 mt15 mb15 ml0 mr0 zb-b">
      <div className="col-auto">
        <div className="fs18 color-grey-900">0.0012 ETH</div>
        <div className="fs12 color-grey-400 text-truncate" style={{maxWidth:'120px'}}>Binance Price</div>
      </div>
      <div className="col-auto">
        <div className="fs18 color-grey-900">+ 12%</div>
        <div className="fs12 color-grey-400 ">24H Change</div>
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
    <div className="row align-items-center zb-b pt15 pb15 bg-white ml0 mr0">
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <MarketHeader />
       </div>
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <div className="fs18 color-green-600">
           0.00107934 ≈ $1.200
         </div>
         <div className="fs12 color-grey-400">
           Latest Price
         </div>
       </div>
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <div className="fs18 color-green-600">
          + 10%
         </div>
         <div className="fs12 color-grey-400">
           24H Change
         </div>
       </div>
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <div className="fs18 color-grey-900">
          0.00116918
         </div>
         <div className="fs12 color-grey-400">
           24H High
         </div>
       </div>
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <div className="fs18 color-grey-900">
          0.00089000
         </div>
         <div className="fs12 color-grey-400">
           24H High
         </div>
       </div>
       <div className="col-sm-6 col-lg-2 zb-b-r">
         <div className="fs18 color-grey-900">
          4,382.34 ETH
         </div>
         <div className="fs12 color-grey-400">
           24H Volume
         </div>
       </div>
    </div>
    <div className="row ml0 mr0">
       <div className="col-sm-6 col-lg-4 pl0">
         <ExchangeItem />
       </div>
       <div className="col-sm-6 col-lg-4">
         <ExchangeItem />
       </div>
       <div className="col-sm-6 col-lg-4 pr0">
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
     <Card title="My Open Orders" className="mt15">
      <Order.List />
     </Card>
   </div>
  )
}