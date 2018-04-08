import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Card,Row,Col,Icon,Tooltip } from 'antd';
import schema from '../../../../modules/tokens/schema';
import Currency from '../../../../modules/settings/CurrencyContainer';
import CoinIcon from '../../../common/CoinIcon'
import intl from 'react-intl-universal'

function ListBlock({LIST={},actions,prices,modal}) {
  const {
      items=[],
      // loading,
      // page={}
  } = LIST
  // const items = tokens.slice(0,6)
  let tokens = window.CONFIG.getTokens()
  items.forEach(item=>{
    let token = tokens.find(token=>token.symbol === item.token)
    if(token){
      item.icon = token.icon
    }
  })

  let sorter = (tokenA,tokenB)=>{
    const pa = Number(tokenA.percentage.replace('%',''))
    const pb = Number(tokenB.percentage.replace('%',''))
    console.log(pa,pb);
    if(pa < pb){
      console.log('pa',pa,'pb',pb);
      return true
    }else{
      return tokenA.token > tokenB.token

    }
  }
  items.sort(sorter)

  const location = (token) => {
    window.routeActions.gotoPath(`/wallet/assets/${token}`);
  }

  const TokenItem = ({item,index})=>{
    const fm = new window.uiFormatter.TokenFormatter({symbol:item.token})
    const priceToken = prices.getTokenBySymbol(item.token)

    const header = (
      <a onClick={location.bind(this, item.token)}>
        <div className="row justify-content-center align-items-center no-gutters">
          <div className="col-auto">
            {
              item.icon &&
              <CoinIcon symbol={item.token} size="20" className="mr5" />
            }
            {
              !item.icon &&
              <i className="mr5 icon-loopring icon-loopring-EMPTY fs20 color-black-7" />
            }
          </div>
          <div className="col">
            <span className="color-black-1 fs1">{item.token}</span>
          </div>
          <div className="col-auto">
              <span className="color-black-1 fs14 mr5">{item.percentage}</span>
              <Tooltip title={intl.get('portfolio.asset_currency_ratio')}>
                <span className="color-black-1 fs12"><Icon type="question-circle" /></span>
              </Tooltip>
          </div>
        </div>
      </a>
    )
    return (
      <Card bordered title={header} className="token-list-card text-left">
        <div className="fs1 color-black-1 mb5 font-weight-bold">
          <Currency />
          {Number(fm.getAmountValue(item.amount,priceToken.price)).toFixed(2)}
        </div>
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="fs14 color-black-3">{Number(fm.getAmount(item.amount)).toFixed(5)}</div>
          </div>
          <div className="col"></div>
          {
            false &&
            <div className="col-auto">
              <div className="fs14 color-green-500">
                <Icon type="arrow-up" />34.5%
              </div>
            </div>
          }

        </div>
      </Card>
    )
  }
  return (
    <Row gutter={30}>
      {
        items.map((item,index)=>
          <Col span={8} key={index} className="mb15">
            <TokenItem item={item} index={index}/>
          </Col>
        )
      }
    </Row>
  )
}

export default ListBlock

