import React from 'react';
import { Icon,Popover,Tabs,Card,Steps } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import Order from '../orders/containers'
import Layout from '../../layout/Layout'

const MarketList = (props)=>{
  
  return (
    <table className="table table-striped">
      <tbody>
        <tr className="">
          <th className="fs12 border-0 "></th>
          <th className="fs12 border-0 ">Pair</th>
          <th className="fs12 border-0 ">Price</th>
          <th className="fs12 border-0 ">Change</th>
          <th className="fs12 border-0 ">Volume</th>
        </tr>
        {
          [1,1,1,1,1].map((item,index)=>
            <tr key={index}>
              <td className="fs12 border-0 color-yellow-600"><Icon type="star" /></td>
              <td className="fs12 border-0 ">LRC/ETH</td>
              <td className="fs12 border-0 color-green-600">0.00113489</td>
              <td className="fs12 border-0 color-green-600">+6.17%</td>
              <td className="fs12 border-0 ">6,767.31 ETH</td>
            </tr>
          )
        }
      </tbody>
    </table>
  )
}

const MarketTabs = (props)=>{
  const tab = (text)=> <div className="fs14">{text}</div>
  return (
    <Tabs defaultActiveKey="Favorites" animated={false} >
      <Tabs.TabPane tab={tab('Favorites')} key="Favorites">
        <div className="pl10 pr10">
          <MarketList />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('ETH')} key="ETH">
        <div className="pl10 pr10">
          <MarketList />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('LRC')} key="LRC">
        <div className="pl10 pr10">
          <MarketList />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab={tab('BTC')} key="BTC">
        <div className="pl10 pr10">
          <MarketList />
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}

const MarketHeader = (props)=>{
  return (
    <Popover
      title={null}
      placement="bottom"
      arrowPointAtCenter={false}
      content={
        <div className="" style={{minWidth:'420px'}}>
          <MarketTabs />
        </div>
      }
    >
      <div className="row align-items-center">
        <div className="col-auto pr5 pl20">
          <Icon className="fs16 color-yellow-600" type="star" />
        </div>
        <div className="col">
          <div className="fs18 color-white">LRC/ETH</div>
          <div className="fs12 color-white opacity-70">Select Market Pair <Icon hidden className="" type="down" /></div>  
          
        </div>
        <div className="col-auto">
          <Icon type="caret-down" className="color-white" />
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
    <div className="row bg-white justify-content-between no-gutters pt15 pb15 pl10 pr10 mt15 mb15 ml0 mr0" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
      <div className="col-auto">
        <div className="fs16 color-grey-900">0.00107934</div>
        <div className="fs12 color-grey-400 text-truncate" style={{maxWidth:'120px'}}>Binance</div>
      </div>
      <div className="col-auto">
        <div className="fs16" style={{color:'#1DB427'}}>+ 12%</div>
        <div className="fs12 color-grey-400 ">24H Change</div>
      </div>
      <div className="col-auto">
        <div className="fs16 color-grey-900">12,127.62 ETH</div>
        <div className="fs12 color-grey-400">24H Volume</div>
      </div>
    </div>
)

export default function Home(props){
  const { children } = props
  return (
   <Layout {...props}>
    <div className="" style={{background:'#0077FF'}}>
      <div className="container">
        <div className="row align-items-center justify-content-between pt15 pb15">
           <div className="col-auto">
             <MarketHeader />
           </div>
           <div className="col-auto">
             <div className="fs18 color-white">
               0.00107934 ≈ $1.200
             </div>
             <div className="fs12 color-white opacity-70">
               Latest Price
             </div>
           </div>
           <div className="col-auto">
             <div className="fs16 " style={{color:'#00E831'}}>
              + 10%
             </div>
             <div className="fs12 color-white opacity-70">
               24H Change
             </div>
           </div>
           <div className="col-auto">
             <div className="fs16 color-white">
              0.00116918
             </div>
             <div className="fs12 color-white opacity-70">
               24H High
             </div>
           </div>
           <div className="col-auto">
             <div className="fs16 color-white">
              0.00089000
             </div>
             <div className="fs12 color-white opacity-70">
               24H High
             </div>
           </div>
           <div className="col-sm-6 col-lg-2">
             <div className="fs16 color-white">
              4,382.34 ETH
             </div>
             <div className="fs12 color-white opacity-70">
               24H Volume
             </div>
           </div>
        </div>
      </div>
    </div>
    
    
    <div className="container">
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
       <Card title="Order Form" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
        <div className="row justify-content-around">
          <div className="col-sm-6 pl40 pr40 zb-b-r">
            <Order.TradeForm side="sell" pair="LRC/ETH" />
          </div>
          <div className="col-sm-6 pl40 pr40">
            <Order.TradeForm side="buy" pair="LRC/ETH" />
          </div>
        </div>
       </Card>
       <div className="bg-white mt15" style={{border:'1px solid #dadada',borderRadius:'6px'}}>
         <Tabs defaultActiveKey="open" animated={false} tabBarStyle={{marginBottom:'0px'}}>
           <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Open Orders</div>} key="open">
             <div className="pt15">
               <Order.List />
             </div>
           </Tabs.TabPane>
           <Tabs.TabPane tab={<div className="fs18 pb5 pt5">My Recent Trades</div>} key="trade">
             <div className="pt15">
               <Trade.List />
             </div>
           </Tabs.TabPane>
         </Tabs>
       </div>
    </div>
   </Layout>
  )
}