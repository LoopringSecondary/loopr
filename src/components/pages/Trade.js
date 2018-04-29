import React from 'react';
import { Icon,Popover,Tabs,Card,Steps,Button,Row,Col,Tooltip } from 'antd'
import { Route } from 'dva/router'
import Trade from '../trades/pages'
import TradeList from '../trades/components/ListSimple'
import Order from '../orders/containers'
import ListOrderBook from '../orders/components/List/ListOrderBook'
import Layout from '../../layout/Layout'
import Market from '../market/components'
import Sockets from '../../modules/socket/containers'
import ModalContainer from '../../modules/modals/container'
import intl from 'react-intl-universal'

const ToLogin = ({modal})=>{
  return (
    <div>
      <div className="text-center pt25 pb25">
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/unlock',targetModalData: {}})} style={{width:'255px'}} type="primary" size="large">{intl.get('buttons.unlock_wallet')}</Button>
        <Button className="m15" onClick={modal.showModal.bind(this,{id:'wallet/generate'})} style={{width:'255px'}} type="default" size="large">{intl.get('buttons.generate_wallet')}</Button>
      </div>
    </div>
  )
}

class TradeFormTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      side:'buy'
    }
  }
  render() {
    const { pair } = this.props
    const { side } = this.state
    const tokenL = pair.split('-')[0].toUpperCase()
    const changeForm = (side)=>{
      this.setState({side})
    }
    return (
      <div className="">
        <div className="fs2 lh25 color-black-1 zb-b-b text-center" style={{padding:'0px 0px 0px'}}>
          {
            false &&
            <Button.Group size="large">
              <Button type="default" className="border-grey-100 pl25 pr25">
                {intl.get('trade.buy')} {tokenL}
              </Button>
              <Button type="default" className="border-grey-100 pl25 pr25">
                {intl.get('trade.sell')} {tokenL}
              </Button>
            </Button.Group>
          }
          {
            true &&
            <div className="row align-items-stretch m0 gutter-10">
              <div className={`col-auto pt10 pb10 pl15 pr15 cursor-pointer zb-b-r ${side === 'buy' ? 'color-green-500 bg-white ' : 'color-black-1'}`} onClick={changeForm.bind(this,'buy')}>
                {intl.get('trade.buy')} {tokenL}
              </div>
              <div className={`col-auto pt10 pb10 pl15 pr15 cursor-pointer ${side === 'sell' ? 'color-red-500 bg-white zb-b-r' : 'color-black-1'}`} onClick={changeForm.bind(this,'sell')}>
                {intl.get('trade.sell')} {tokenL}
              </div>
            </div>
          }
        </div>
        <div className="">
          {
            side === 'buy' &&
            <Order.TradeForm side="buy" pair={pair} />
          }
          {
            side === 'sell' &&
            <Order.TradeForm side="sell" pair={pair} />
          }
        </div>
      </div>
    );
  }
}

export default function Home(props){
  const { children, match } = props
  let pair = match.params.pair || window.STORAGE.markets.getCurrent() || 'LRC-WETH'
  if(pair.indexOf('-') < 0){ }
  // TODO if market is not support or goto some route

  const tabChange = (key) => {
    if(window.WALLET && window.WALLET.getAddress()) {
      switch(key) {
        case 'orders': refreshOrders(); break;
        case 'trades': refreshTrades(); break;
        default: break;
      }
    }
  };
  const refreshOrders = ()=>{
    window.STORE.dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade'
      }
    })
  };
  const refreshTrades = ()=>{
    window.STORE.dispatch({
      type:'trades/filtersChange',
      payload:{
        id:'orders/trade'
      }
    })
  };

  return (
    <Layout {...props}>
      <Sockets.TickersByPair pair={pair}>
        <Sockets.Prices>
          <Market.TickerItem pair={pair} />
        </Sockets.Prices>
      </Sockets.TickersByPair>
      <div className="container">
        {
          true &&
          <div className="zb-b">
            <div className="row align-items-stretch gutter-0 bg-white">
              <div className="col-auto zb-b-r" style={{flex:'0 0 30%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.order_book')}
                  <span className="ml5">
                    <Tooltip title={
                      <div className="p5 lh24">
                        <div className="fs14">交易深度正在测试中</div>
                        <div className="fs12 text-nowrap">
                          1. 交易模式与传统交易所显著不同
                        </div>
                        <div className="fs12">
                          2. 当前版本的内容仅供参考
                        </div>
                        <div className="fs12">
                          3. 正式版本可正常使用
                        </div>

                      </div>
                    } className="">
                      <Icon type="question-circle-o"  />
                    </Tooltip>
                  </span>
                </div>
                <div>
                  <Sockets.Depth market={pair}>
                    <Sockets.Prices>
                      <ListOrderBook market={pair} />
                    </Sockets.Prices>
                  </Sockets.Depth>
                </div>
              </div>
              <div className="col zb-b-r" style={{flex:'0 0 40%'}}>
                <TradeFormTab pair={pair} />
              </div>
              <div className="col-auto" style={{flex:'0 0 30%'}}>
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.trade_history')}
                  <span className="ml5">
                    <Tooltip title={
                      <div className="p5 lh24">
                        <div className="fs14">成交记录正在测试中</div>
                        <div className="fs12 text-nowrap">
                          1. 交易模式与传统交易所显著不同
                        </div>
                        <div className="fs12">
                          2. 当前版本的内容仅供参考
                        </div>
                        <div className="fs12">
                          3. 正式版本可正常使用
                        </div>

                      </div>
                    } className="">
                      <Icon type="question-circle-o"  />
                    </Tooltip>
                  </span>
                </div>
                <div>
                  <Sockets.Trades market={pair}>
                    <TradeList market={pair} />
                  </Sockets.Trades>
                </div>
              </div>

            </div>
          </div>
        }

        <div className="zb-b">
          <div className="bg-white mt15">
            <Tabs defaultActiveKey="orders" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
              <Tabs.TabPane tab={<div className="fs16 lh25">{intl.get('tabs.my_open_orders')}</div>} key="orders">
                <div className="">
                  {
                    window.WALLET && window.WALLET.getAddress() &&
                    <Order.List id="orders/trade" />
                  }
                  {
                    !(window.WALLET && window.WALLET.getAddress()) &&
                    <ModalContainer apisOnly={true}>
                      <ToLogin />
                    </ModalContainer>
                  }
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<div className="fs16 lh25">{intl.get('tabs.my_recent_trades')}</div>} key="trades">
                <div className="">
                  {
                    window.WALLET && window.WALLET.getAddress() &&
                    <Trade.List />
                  }
                  {
                    !(window.WALLET && window.WALLET.getAddress()) &&
                    <ModalContainer apisOnly={true}>
                      <ToLogin />
                    </ModalContainer>
                  }
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        <div className="mb50"></div>
      </div>
    </Layout>
  )
}
