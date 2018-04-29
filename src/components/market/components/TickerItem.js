import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon,Popover,Row,Col } from 'antd';
import TickerListTabs from './TickerListTabs'
import Sockets from '../../../modules/socket/containers'
import Currency from '../../../modules/settings/CurrencyContainer'
import intl from 'react-intl-universal'
import TickerTrend from 'Loopr/TickerTrend'

const fm = window.uiFormatter.TickerFormatter

class TickerHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const favors = window.STORAGE.markets.getFavors()
    const {pair,tickers} = this.props;
    return (
      <Popover
        title={null}
        placement="bottom"
        arrowPointAtCenter={false}
        trigger="hover"
        overlayClassName="tickers-list-popover"
        content={
          <div className="" style={{minWidth:'320px'}}>
            <Sockets.TickersByLoopring>
              <TickerListTabs />
            </Sockets.TickersByLoopring>
          </div>
        }
      >
        <div className="row align-items-center cursor-pointer ml0 mr0 gutter-0" style={{background:'rgba(0,0,0,0.05)',width:'200px'}}>
          <div className="col pl25 pt15 pb15">
            <div className="fs16 color-white">
              {pair}
              {
                false && favors[pair] &&
              <Icon onClick={tickers.toggleFavor} className="mr10 fs16 color-yellow-600 pointer" type="star" />
              }
              {
                false && !favors[pair] &&
              <Icon onClick={tickers.toggleFavor} className="mr10 fs16 color-white pointer" type="star-o" />
              }

            </div>
            <div className="fs14 color-white color-white-2">{intl.get('ticker.select_a_market')} <Icon className="ml5" type="down" /></div>
          </div>

        </div>
      </Popover>
    );
  }
}


class LooprTicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
      const {pair='',tickers={},price=0} = this.props
      const tokenL = pair.split('-')[0]
      const tokenR = pair.split('-')[1]
      const ticker = tickers.loopr || {} // fix bug: when init loopr is null
      const priceValue = (
        <span className="color-white-2">
          <Currency />
          {(price*ticker.last).toFixed(3)}
        </span>
      )

      const NumberCaption = ({title,content})=>(
        <div className="pt15 pb15">
          <div className="fs16 color-white">{content}</div>
          <div className="fs13 color-white-2">{title}</div>
        </div>
      )
      return (
          <div className="row align-items-center ml0 mr0 gutter-0">
             <div className="col pl0 text-nowrap">
               <TickerHeader pair={pair} tickers={tickers} />
             </div>
             <div className="col pl20 pr20">
               <NumberCaption title={intl.get('ticker.last')} content={<div className="text-truncate" style={{maxWidth:'160px'}}>{fm.getPrice(ticker.last)} {priceValue}</div>} />
             </div>
             <div className="col pl20 pr20">
              <NumberCaption title={`24H ${intl.get('ticker.change')}`} content={
                <TickerTrend mode="nocolor" side={fm.getChangeSide(ticker.change)}>
                  {fm.getChange(ticker.change)}
                </TickerTrend>
              } />
             </div>
             <div className="col pl20 pr20">
              <NumberCaption title={`24H ${intl.get('ticker.low')}`} content={<div className="text-truncate" style={{maxWidth:'160px'}}>{fm.getPrice(ticker.low)}</div>} />
             </div>
             <div className="col pl20 pr20">
               <NumberCaption title={`24H ${intl.get('ticker.high')}`} content={<div className="text-truncate" style={{maxWidth:'160px'}}>{fm.getPrice(ticker.high)}</div>} />
             </div>
             <div className="col-auto pl20 pr20">
              <NumberCaption title={<div>24H {intl.get('ticker.vol')}</div>} content={<div>{`${fm.getVolume(ticker.vol)}`}  <span className="">{tokenR}</span></div>} />
             </div>
          </div>
      )
  }
}
const ExchangeItem = ({pair='',ticker={},price=0})=>{
    const tokenL = pair.split('-')[0]
    const tokenR = pair.split('-')[1]
    const priceValue = (
      <span className="fs14 color-black-3">
        <Currency />{(price*ticker.last).toFixed(3)}
      </span>
    )
    return (
        <div className="row bg-white zb-b justify-content-between no-gutters pt10 pb10 pl10 pr10 ml0 mr0">
          <div className="col-auto">
            <div className="fs14 color-black-1">
              {fm.getPrice(ticker.last)} {priceValue}
            </div>
            <div className="fs13 color-black-3 text-truncate text-capitalize" style={{maxWidth:'120px'}}>
            {intl.get(`exchanges.${ticker.exchange}`)}
            </div>
          </div>
          <div className="col-auto text-right">
            <div className="fs14 ">
              <TickerTrend side={fm.getChangeSide(ticker.change)}>
                {fm.getChange(ticker.change)}
              </TickerTrend>
            </div>
            <div className="fs13 color-black-3 ">24H {intl.get('ticker.change')}</div>
          </div>
          <div className="col-auto text-right">
            <div className="fs14 color-black-1">{fm.getVolume(ticker.vol) || fm.getVolume(ticker.amount*ticker.last) }</div>
            <div className="fs13 color-black-3">24H {intl.get('ticker.vol')}</div>
          </div>
        </div>
      )

}
class Ticker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {pair,tickersByPair:tickers={},prices={}} = this.props;
    const tokenL = pair.split('-')[0]
    const tokenR = pair.split('-')[1]
    const token = prices.getTokenBySymbol(tokenR,true)
    let length = 0
    if(tickers.binance){
        length += 1
    }
    if(tickers.okex){
        length += 1
    }
    if(tickers.huobi){
        length += 1
    }
    const colSpan = 24 / length
    return (
      <div>
        <div className="" style={{background:'#0077FF'}}>
          <div className="container">
            <LooprTicker pair={pair} tickers={tickers} price={token.price} />
          </div>
        </div>
        <div className="container">
          <Row className="mt5 mb5" gutter={10}>
             {
              tickers.binance &&
              <Col span={colSpan} className="mt5 mb5">
                <ExchangeItem pair={pair} ticker={tickers.binance} price={token.price} />
              </Col>
             }
             {
              tickers.okex &&
              <Col span={colSpan} className="mt5 mb5">
                <ExchangeItem pair={pair} ticker={tickers.okex} price={token.price} />
              </Col>
             }
             {
              tickers.huobi &&
              <Col span={colSpan} className="mt5 mb5">
                <ExchangeItem pair={pair} ticker={tickers.huobi} price={token.price} />
              </Col>
             }

          </Row>
        </div>
      </div>

    );
  }
}
export default Ticker;
