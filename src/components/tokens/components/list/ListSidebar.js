import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Icon, Input, Popover, Tooltip} from 'antd';
import './ListSidebar.less'
import * as fm from '../../../../common/Loopring/common/formatter'
import CurrencyContainer from '../../../../modules/settings/CurrencyContainer';
import {toNumber, toBig} from "Loopring/common/formatter";
import CoinIcon from '../../../common/CoinIcon'
import intl from 'react-intl-universal'
import Token from 'Loopring/ethereum/token'
import config from '../../../../common/config'
import Notification from 'Loopr/Notification'


class ListSidebar extends React.Component {

  state = {
    customTokens: []
  };

  loadBalance = (item) => {
    const token = new Token(item);
    token.balanceOf(window.WALLET.getAddress(), 'latest').then(res => {
      if (!res.error) {
        const {customTokens} = this.state;
        const filteredToken = customTokens.filter(ele => ele.address !== item.address);
        filteredToken.push({...item, balance: toBig(res.result).div('1e' + item.digits)});
        this.setState({customTokens: filteredToken});
      }
    })
  };

  getbalance = (item) => {
    return this.state.customTokens.find(ele => ele.address === item.address)
  };

  componentDidMount() {
    const {selectedToken, LIST, actions, dispatch} = this.props;
    let {selected = {}} = LIST
    if (selectedToken) {
      let new_selected = {}
      for (let key in selected) {
        new_selected[key] = false
      }
      actions.selectedChange({
        selected: {
          ...new_selected,
          [selectedToken]: true,
        }
      })
      dispatch({
        type: 'transactions/filtersChange',
        payload: {
          filters: {token: selectedToken}
        }
      })
    }
  }

  render() {
    const {LIST, actions, dispatch, assets = {}, prices = {}} = this.props;
    const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address'
    let {
      items = [],
      selected = {},
      favored = {},
      loading,
      filters = {},
      page = {}
    } = LIST
    items.forEach(item => {
      const assetToken = assets.getTokenBySymbol(item.symbol, true)
      const priceToken = prices.getTokenBySymbol(item.symbol, true)
      item.balance = assetToken.balance
      item.allowance = assetToken.allowance
      item.price = priceToken.price
    })
    const showModal = (payload) => {
      dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        }
      })
    }
    const gotoTransfer = (item, e) => {
      e.stopPropagation()
      showModal({
        id: 'token/transfer',
        item,
      })
    }
    const gotoReceive = (item, e) => {
      e.stopPropagation()
      showModal({
        id: 'token/receive',
        symbol: item.symbol.toUpperCase(),
      })
    };
    const gotoConvert = (item) => {
      showModal({
        id: 'token/convert',
        item,
        showFrozenAmount: false
      })
    }
    const isSupportToTrade = (token) => {
      const supportedToken = config.getSupportedMarketsTokenR()
      if (supportedToken) {
        let foundMarket = ''
        if (supportedToken.includes(token)) {
          const markets = config.getMarketsByTokenR(token)
          if (markets) {
            foundMarket = markets[0].tokenx + "-" + markets[0].tokeny
          }
        } else {
          const tokenR = supportedToken.find((x, i) => {
            const market = token + "-" + x
            if (config.isSupportedMarket(market)) {
              return true
            }
          })
          if (tokenR) foundMarket = token + "-" + tokenR
        }
        if (foundMarket) {
          return true
        }
      }
      return false
    }
    const gotoTrade = (item) => {
      const foundMarket = config.getTokenSupportedMarket(item.symbol)
      if (foundMarket) {
        window.routeActions.gotoPath('/trade/' + foundMarket)
        return
      }
      Notification.open({
        type: 'warning',
        message: intl.get('trade.not_supported_token_to_trade_title', {token: item.symbol}),
        description: intl.get('trade.not_supported_token_to_trade_content')
      });
    }

    const gotoAdd = () => {
      showModal({
        id: 'token/add',
      })
    }
    const toggleMyFavorite = () => {
      actions.filtersChange({
        filters: {
          ...filters,
          ifOnlyShowMyFavorite: !filters.ifOnlyShowMyFavorite
        }
      })
    }
    const toggleSmallBalance = () => {
      actions.filtersChange({
        filters: {
          ...filters,
          ifHideSmallBalance: !filters.ifHideSmallBalance
        }
      })
    }
    const searchToken = (e) => {
      actions.filtersChange({
        filters: {
          ...filters,
          keywords: e.target.value
        }
      })
    }
    const toggleFavored = (item, e) => {
      e.stopPropagation()
      actions.favoredChange({
        favored: {
          [item.symbol]: !favored[item.symbol], // TODO address
        }
      })
    }
    const toggleSelected = (item) => {
      let new_selected = {}
      for (let key in selected) {
        new_selected[key] = false
      }
      actions.selectedChange({
        selected: {
          ...new_selected,
          [item.symbol]: true, // TODO address
        }
      })
      updateTransations(item.symbol)
    }
    const updateTransations = (token) => {
      dispatch({
        type: 'transactions/filtersChange',
        payload: {
          filters: {token}
        }
      })
    }
    const TokenListAcionsBar = (
      <div className="row zb-b-b p15 pl10 pr10 no-gutters align-items-center">
        <div className="col">
          <Input
            placeholder=""
            prefix={<Icon type="search" className="color-grey-600"/>}
            suffix={
              <div className="row gutter-0 align-items-center">
                <div className="col"></div>
                <div className="col-auto pr5">
                  <Tooltip title={intl.get('tokens.only_show_favorites')}>
                    {
                      filters.ifOnlyShowMyFavorite &&
                      <Icon type="star" onClick={toggleMyFavorite.bind(this)}
                            className="fs16 color-primary-1 border-none pointer"
                      />
                    }
                    {
                      !filters.ifOnlyShowMyFavorite &&
                      <Icon onClick={toggleMyFavorite.bind(this)} className="fs16 color-black-2 pointer"
                            type="star-o"/>
                    }
                  </Tooltip>
                </div>
                <div className="col-auto zb-b-l pl5">
                  <Tooltip title={intl.get('tokens.hide_small_balances')}>
                    {
                      filters.ifHideSmallBalance &&
                      <Icon onClick={toggleSmallBalance.bind(this)} className="fs18 color-primary-1 pointer"
                            style={{position: 'relative', marginTop: '2px'}}
                            type="eye"/>
                    }
                    {
                      !filters.ifHideSmallBalance &&
                      <Icon onClick={toggleSmallBalance.bind(this)} className="fs18 color-black-2 pointer"
                            style={{position: 'relative', marginTop: '2px'}}
                            type="eye-o"/>
                    }
                  </Tooltip>
                </div>
              </div>
            }
            className="d-block w-100"
            onChange={searchToken.bind(this)}
            value={filters.keywords}
            addonAfter={null}
          />
        </div>
      </div>
    )
    const TokenItemActions = (token) => (
      <div style={{minWidth: '150px', maxWidth: '250px'}}>
        <div className="row no-gutters p5">
          <div className="col-12 p5">
            <Button onClick={gotoTransfer.bind(this, token)} className="d-block w-100 text-left" type="primary"
                    disabled={isWatchOnly}>
              <i className="icon icon-loopring icon-loopring-transfer fs16 color-white mr5"/>
              {intl.get('tokens.options_transfer')} {token.symbol}
            </Button>
          </div>
          <div className="col-12 p5">
            <Button onClick={gotoReceive.bind(this, token)} className="d-block w-100 text-left" type="primary">
              <i className="icon icon-loopring icon-loopring-receive fs16 mr5"/>
              {intl.get('tokens.options_receive')} {token.symbol}
            </Button>
          </div>
          {
            (token.symbol === 'ETH') &&
            <div className="col-12 p5">
              <Button onClick={gotoConvert.bind(this, token)} className="d-block w-100 text-left" type="primary"
                      disabled={isWatchOnly}>
                <i className="icon icon-loopring icon-loopring-trade fs16 mr5"/>
                {intl.get('token.token_convert', {from: token.symbol, to: 'WETH'})}
              </Button>
            </div>
          }
          {
            (token.symbol === 'WETH') && !token.custom &&
            <div className="col-12 p5">
              <Button onClick={gotoConvert.bind(this, token)} className="d-block w-100 text-left" type="primary"
                      icon="retweet" disabled={!!isWatchOnly}>
                {intl.get('token.token_convert', {from: token.symbol, to: 'ETH'})}
              </Button>
            </div>
          }
          {
            (token.symbol !== 'ETH' && token.symbol !== 'WETH') &&
            <div className="col-12 p5">
              <Button onClick={gotoTrade.bind(this, token)} className="d-block w-100 text-left" type="primary"
                      disabled={isWatchOnly}>
                <i className="fa fa-line-chart mr5"/>
                {intl.get('tokens.options_trade')} {token.symbol}
              </Button>
            </div>
          }
        </div>
      </div>
    );
    const NotEnoughTip = ({token}) => {
      return (
        <div className="p15">
          <div className="text-center">
            <Icon className="color-red-500 mr10 fs30" type="exclamation-circle"/>
            <div className="fs16 mt10 mb10">
              Balance is not enough for orders
            </div>
            <div>
              <Button onClick={gotoReceive.bind(this, token)} className="m5 color-blue-500">Receive</Button>
              <Button onClick={gotoTrade.bind(this, token)} className="m5 color-blue-500"
                      disabled={isWatchOnly}>Buy</Button>
              {
                token.symbol === 'WETH' &&
                <Button onClick={gotoConvert.bind(this, token)} className="m5 color-blue-500" disabled={isWatchOnly}>Convert</Button>
              }
            </div>

          </div>
        </div>
      )
    };
    const TokenItem = ({item, index}) => {
      const TokenFormatter = window.uiFormatter.TokenFormatter
      let tokenFm = new TokenFormatter(item)
      return (
        <div onClick={toggleSelected.bind(this, item)}
             className={`zb-b-b cursor-pointer token-item-sidebar ${selected[item.symbol] && 'token-item-sidebar-dark'}`}>
          <div className={`row align-items-center no-gutters p10`}>
            <div className="col-auto pr10">
              {
                favored[item.symbol] &&
                <Icon type="star" className="color-yellow-700" onClick={toggleFavored.bind(this, item)}/>
              }
              {
                !favored[item.symbol] &&
                <Icon type="star" className="color-grey-300" onClick={toggleFavored.bind(this, item)}/>
              }
            </div>
            <div className="col-auto pr10">
              {selected[item.symbol] &&
              <CoinIcon symbol={item.symbol} size="32" color="white"/>
              }
              {!selected[item.symbol] &&
              <CoinIcon symbol={item.symbol} size="32"/>
              }
            </div>
            <div className="col pr10">
              <div className="">
                <span className="fs2 color-black-1">{item.symbol}</span>
                <span className="fs2 ml5 color-black-3 ">
                {item.name}
              </span>
              </div>
              <div className="">
                <span className="fs3 color-black-1">{tokenFm.getBalance()}</span>
                {!!toNumber(tokenFm.getBalance()) &&
                <span>
                  <span className="fs3 ml5 color-black-3"><CurrencyContainer/></span>
                  <span className="fs14 color-black-3">{tokenFm.getBalanceValue(item.price)}</span>
              </span>}
              </div>
            </div>
            {
              false && index > 0 && index < 3 &&
              <div className="col-auto pr5">
                <Popover
                  title={<div className="pt5 pb5 fs18">{item.symbol}</div>}
                  placement="bottom"
                  arrowPointAtCenter
                  content={<NotEnoughTip token={item}/>}
                >
                  <Icon type="exclamation-circle" className="color-red-500"/>
                </Popover>
              </div>
            }
            {
              false &&
              <div className="col-auto" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault()
              }}>
                <Popover
                  title={<div className="pt5 pb5 fs18">{item.symbol} {intl.get('tokens.options')}</div>}
                  placement="right"
                  arrowPointAtCenter
                  content={TokenItemActions(item)}
                >
                  <i className="icon-loopring icon-loopring-right color-black-3 d-block"></i>
                </Popover>
              </div>
            }

            <div className="col-auto" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault()
            }}>
              <i className="icon-loopring icon-loopring-right color-black-3 d-block"></i>
            </div>

          </div>
        </div>
      )
    }

    const selectCustomToken = (item) => {
      toggleSelected(item);
      this.loadBalance(item)
    };

    const CustomTokenItem = ({item}) => {
      return (
        <div onClick={selectCustomToken.bind(this, item)}
             className={`zb-b-b cursor-pointer token-item-sidebar ${selected[item.symbol] && 'token-item-sidebar-dark'}`}>
          <div className={`row align-items-center no-gutters p10`}>
            <div className="col-auto pr10">
              {
                favored[item.symbol] &&
                <Icon type="star" className="color-yellow-700" onClick={toggleFavored.bind(this, item)}/>
              }
              {
                !favored[item.symbol] &&
                <Icon type="star" className="color-grey-300" onClick={toggleFavored.bind(this, item)}/>
              }
            </div>
            <div className="col-auto pr10">
              {selected[item.symbol] && item.icon &&
              <CoinIcon symbol={item.symbol} size="32" color="white"/>
              }
              {selected[item.symbol] && !item.icon &&
              <i className="icon-loopring icon-loopring-EMPTY fs32 color-grey-200"/>
              }
              {!selected[item.symbol] && item.icon &&
              <CoinIcon symbol={item.symbol} size="32"/>
              }
              {!selected[item.symbol] && !item.icon &&
              <i className="icon-loopring icon-loopring-EMPTY fs32 color-grey-200"/>
              }
            </div>
            <div className="col pr10">
              <div className="">
                <span className="fs2 color-black-1">{item.symbol}</span>
                <span className="fs3 ml5 color-black-3 ">
                {item.name}
              </span>
              </div>
              <div className="">
                <span
                  className="fs3 color-black-1">{this.getbalance(item) && this.getbalance(item).balance.toFixed(8)}</span>
              </div>
            </div>
            <div className="col-auto" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault()
            }}>
              <Popover
                title={<div className="pt5 pb5 fs18">{item.symbol} {intl.get('tokens.options')}</div>}
                placement="right"
                arrowPointAtCenter
                content={TokenItemActions(item)}
              >
                <i className="icon-loopring icon-loopring-right color-black-3 d-block"/>
              </Popover>
            </div>

          </div>
        </div>
      )
    }
    let customs = window.STORAGE.tokens.getCustomTokens()
    let results = [...items, ...customs]
    results = results.filter(token => token.symbol !== 'WETH_OLD')

    // eth weth lrc
    const ethToken = results.find(token => token.symbol === 'ETH')
    const wethToken = results.find(token => token.symbol === 'WETH')
    const lrcToken = results.find(token => token.symbol === 'LRC')
    // other tokens
    let otherTokens = results.filter(token => (token.symbol !== 'ETH' && token.symbol !== 'WETH' && token.symbol !== 'LRC'))
    otherTokens = otherTokens.map((token, index) => {
      let balance = fm.toBig(token.balance).div('1e' + token.digits).toNumber()
      token.sortByBalance = balance
      return token
    })
    const sorter = (tokenA, tokenB) => {
      const pa = Number(tokenA.sortByBalance);
      const pb = Number(tokenB.sortByBalance);
      if (pa === pb) {
        return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
      } else {
        return pb - pa;
      }
    };
    otherTokens.sort(sorter);

    let sortedTokens = new Array()
    if (lrcToken) {
      sortedTokens.push(lrcToken)
    }
    if (ethToken) {
      sortedTokens.push(ethToken)
    }
    if (wethToken) {
      sortedTokens.push(wethToken)
    }

    sortedTokens = sortedTokens.concat(otherTokens)

    let formatedTokens = [...sortedTokens]

    let keys = Object.keys(filters)
    keys.map(key => {
      const value = filters[key]
      if (key === 'ifOnlyShowMyFavorite') {
        if (value) {
          formatedTokens = formatedTokens.filter(token => !!favored[token.symbol] === !!value)
        }
      }
      if (key === 'ifHideSmallBalance') {
        if (value) {
          formatedTokens = formatedTokens.filter(token => fm.toNumber(token['balance']) > 0)
        }
      }
      if (key === 'keywords') {
        formatedTokens = formatedTokens.filter(token => {
          let text = (token.symbol + token.title).toLowerCase()
          return text.indexOf(value.toLowerCase()) > -1
        })
      }
    })
    return (
      <div className="token-list-container">
        {TokenListAcionsBar}
        <div className="token-list-sidebar">
          {
            formatedTokens.map((item, index) => {
              if (!item.custom) {
                return <TokenItem key={index} index={index} item={item}/>
              } else {
                return <CustomTokenItem key={index} index={index} item={item}/>
              }
            })
          }
          {
            false && (filters.keywords || filters.ifOnlyShowMyFavorite || filters.ifHideSmallBalance) &&
            <div className='zb-b-b token-item-sidebar text-center pt10 pb10'>
              Find {formatedTokens.length} Tokens
            </div>
          }
          {
            false &&
            <div className='zb-b-b cursor-pointer token-item-sidebar text-center pt10 pb10'
                 onClick={showModal.bind(this, {id: "token/add"})}>
              <Icon type="plus"/>
              {intl.get('tokens.add_token')}
            </div>
          }
        </div>
      </div>
    )


  }


}

export default connect()(ListSidebar)

