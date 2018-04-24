import React from 'react';
import {connect} from 'dva';
import { Card, Col, Row ,Avatar,Icon,Tabs} from 'antd'
import Tokens from '../tokens/pages'
import TokensComp from '../tokens/components'
import Layout from '../../layout/Layout'
import Sockets from '../../modules/socket/containers'
import * as Recharts from 'recharts'
import * as fm from '../../common/Loopring/common/formatter'
import circleChart from '../../assets/images/portfolio-circle-chart.png'
import Currency from '../../modules/settings/CurrencyContainer'
import {accAdd, accSub, accMul, accDiv} from '../../common/Loopring/common/math'
import intl from 'react-intl-universal'

class AssetsPieChart extends React.Component{
  sortAssetsByWorth(portfolio, prices) {
    if(!portfolio || portfolio.size == 0 || !prices || prices.size == 0) {
      return;
    }
    let hasNo0Balance = false
    portfolio.map(item=>{
      if(fm.toBig(item.amount).greaterThan(0)) hasNo0Balance = true
    })
    let worthArray = null
    if(hasNo0Balance) {
      worthArray = portfolio.map(item=>{
        const price = prices.getTokenBySymbol(item.token).price
        const tokenConfig = window.CONFIG.getTokenBySymbol(item.token)
        const amount = item.amount > 0 ? fm.toBig(item.amount).div("1e"+tokenConfig.digits) : fm.toBig(0)
        const worth = amount.times(price).toNumber().toFixed(0)
        return {token:item.token, amount: item.amount, worth: worth, percentage: item.percentage}
      })
    } else {
      worthArray = []
    }
    const sequence = (a,b) => {
      const va = fm.toNumber(a.worth)
      const vb = fm.toNumber(b.worth)
      if (va > vb) {
        return -1;
      } else if (va < vb){
        return 1
      } else {
        return 0;
      }
    }
    worthArray.sort(sequence)
    let showArray = new Array(), otherWorth = 0, otherAmount = 0
    worthArray.map(item=>{
      const per = fm.toNumber(item.percentage.toString().split("%")[0])
      if(per < 0.05) {
        otherWorth += fm.toNumber(item.worth)
        otherAmount += fm.toNumber(item.amount)
      } else {
        showArray.push(item)
      }
    })
    if(showArray.length >0 ){
      showArray.push({token:'OTHERS', amount:otherAmount, worth:otherWorth})
    } else {
      showArray.push({token: 'Assets', amount:0, worth: 1, percentage: "100%"})
    }
    return showArray
  }

  render () {
    const {prices, portfolio} = this.props
    let COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#F9FF6A', '#FF76F7', '#97FAFF'];
    const worth = this.sortAssetsByWorth(portfolio.items, prices)
    const {PieChart, Pie, Sector, Cell} = Recharts
    const data = worth.map(item=> {
      return {name: item.token, amount: item.amount, value: fm.toNumber(item.worth)}
    })
    if(data.length === 1 && data[0].amount === 0) {
      COLORS = ['#eee']
    }
    // console.log(data, data.length)
    //const data = [{name: "ETH", value: 1},{name: "WETH", value: 0},{name: "EOS", value: 0},{name: "AE", value: 0},{name: "RDN", value: 0},{name: "OTHERS", value: 0}]

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x  = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy  + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <PieChart width={1000} height={400} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data}
          innerRadius={140}
          outerRadius={160}
          fill="#8884d8"
          paddingAngle={2}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {
            data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
    );
  }
}

class AssetsWorth extends React.Component{
  render () {
    const {assets, prices} = this.props
    let totalWorth = 0
    assets.items.map(item=>{
      const tokenConfig = window.CONFIG.getTokenBySymbol(item.symbol)
      const amount = item.balance > 0 ? fm.toBig(item.balance).div("1e"+tokenConfig.digits) : fm.toBig(0)
      const worth = amount.times(prices.getTokenBySymbol(item.symbol).price).toNumber().toFixed(1)
      totalWorth = accAdd(totalWorth, worth)
    })
    if(totalWorth > 1000000001){
      return (
        <span className="fs24 color-black-1 font-weight-bold">
          <Currency /> {totalWorth}
        </span>
      )
    }
    if(totalWorth<=100000000){
      return (
        <span className="fs36 color-black-1 font-weight-bold">
          <Currency /> {totalWorth}
        </span>
      )
    }
  }
}

const Portfolio = (props) => {
  return (
    <div className="p30 container">
      <div style={{textAlign:"center",position:'relative'}}>
        {
          false &&
          <Sockets.Portfolio>
            <Sockets.Prices>
              <AssetsPieChart/>
            </Sockets.Prices>
          </Sockets.Portfolio>
        }
        <img src={circleChart} alt="" style={{width:'320px'}}/>
        <div style={{position:'absolute','top':'115px',textAlign:'center',width:'100%'}}>
          <div className="color-grey-900 mt10">
            <Sockets.Prices>
              <Sockets.Assets>
                <AssetsWorth/>
              </Sockets.Assets>
            </Sockets.Prices>
          </div>
          <div className="fs18 color-black-3">
            {intl.get('portfolio.total_value')}
          </div>
        </div>

      </div>
      <div className="pt30 pb20">
        <Sockets.Portfolio>
          <Sockets.Prices>
            <TokensComp.ListCard />
          </Sockets.Prices>
        </Sockets.Portfolio>
      </div>
      {
        false &&
        <Tabs defaultActiveKey="assets" animated={false} className="rs nobar noline text-right">
          <Tabs.TabPane tab={<div className="fs18 p5 text-center"><Icon type="appstore-o" /></div>} key="assets" >
            <div className="mb10"></div>
            <Sockets.Portfolio>
              <Sockets.Prices>
                <TokensComp.ListCard />
              </Sockets.Prices>
            </Sockets.Portfolio>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs18 p5 text-center"><Icon type="bars" /></div>} key="orders" >
            <div className="mb10"></div>
            <Sockets.Portfolio>
              <Sockets.Prices>
                <Tokens.List />
              </Sockets.Prices>
            </Sockets.Portfolio>
          </Tabs.TabPane>
        </Tabs>

      }

    </div>
  )
};


export default connect()(Portfolio)
