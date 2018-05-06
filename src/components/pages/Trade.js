import React from 'react';
import { Icon,Popover,Tabs,Card,Steps,Button,Row,Col,Tooltip,Alert,Collapse } from 'antd'
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
// import Alert from 'Loopr/Alert'

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
          <div className="row align-items-stretch m0 gutter-10">
            <div className={`col-6 pt10 pb10 pl15 pr15 cursor-pointer zb-b-r ${side === 'buy' ? 'color-green-500 bg-white' : 'color-black-1'}`} onClick={changeForm.bind(this,'buy')}>
              {intl.get('trade.buy')} {tokenL}
            </div>
            <div className={`col-6 pt10 pb10 pl15 pr15 cursor-pointer ${side === 'sell' ? 'color-red-500 bg-white zb-b-r' : 'color-black-1'}`} onClick={changeForm.bind(this,'sell')}>
              {intl.get('trade.sell')} {tokenL}
            </div>
          </div>
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
  const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    border: 0,
    overflow: 'hidden',
  };

  return (
    <Layout {...props}>
      <Sockets.TickersByPair pair={pair}>
        <Sockets.Prices>
          <Market.TickerItem pair={pair} />
        </Sockets.Prices>
      </Sockets.TickersByPair>
      <div className="container">
          <div className="zb-b bg-white">
            <div className="row align-items-stretch gutter-0 ">
              <div className="col-4 zb-b-r">
                <TradeFormTab pair={pair} />
                <div className="fs12 p10 pt0 color-black-3" style={{marginTop:'-10px'}}>
                  {intl.getHTML('testtips.tradetips_description')}
                </div>
              </div>
              <div className="col-4 zb-b-r">
                <div className="fs2 lh25 color-black-1 zb-b-b text-center" style={{padding:'0px 0px 0px'}}>
                  <div className="row align-items-stretch m0 gutter-10">
                    <div className={`col-auto pt10 pb10 pl15 pr15 color-black-1`}>
                      {intl.get('trade.order_book')}
                    </div>
                    <div className="col"></div>
                    {
                      false &&
                      <div className={`col-auto pt10 pb10 pl10 pr10 cursor-pointer color-black-3 fs12`}>
                       ☉ 合并深度
                      </div>
                    }
                  </div>
                </div>
                <div>
                  <Sockets.Depth market={pair}>
                    <Sockets.Prices>
                      <ListOrderBook market={pair} />
                    </Sockets.Prices>
                  </Sockets.Depth>
                </div>
              </div>
              <div className="col-4">
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.trade_history')}
                </div>
                <div>
                  <Sockets.Trades market={pair}>
                    <TradeList market={pair} />
                  </Sockets.Trades>
                </div>
              </div>
            </div>

          </div>
        <div className="zb-b mt10 bg-white">
          <Tabs className="zb-b-t" defaultActiveKey="orders" animated={false} tabBarStyle={{marginBottom:'0px'}} onChange={tabChange}>
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
        { intl.getHTML('testtips.trades_faq') &&
        <div className="mt10 zb-b bg-white">
          <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
            {intl.get('testtips.trades_faq')}
          </div>
          <div className="zb-b-t">
            {
              intl.getHTML('testtips.trades_faq') &&
              <Collapse accordion bordered={false} className="zb-b" defaultActiveKey={[]}>
                {Array(9).fill(1).map((item,index)=>
                  <Collapse.Panel className="border-none zb-b-b" header={
                    <div className="fs16 color-black-1">
                      <span className="font-weight-bold mr5">{intl.get(`testtips.trades_faq_arr.${index}.category`)}</span>
                      {intl.get(`testtips.trades_faq_arr.${index}.title`)}
                    </div>
                  } key={index}>
                    <div className="fs13 lh25 color-black-2 zb-b-t pt10 ">
                      {intl.getHTML(`testtips.trades_faq_arr.${index}.content`)}
                    </div>
                  </Collapse.Panel>
                )}
              </Collapse>
            }
          </div>
        </div>
        }
        <div className="mb50"></div>
      </div>
    </Layout>
  )
}
