import React from 'react';
import {connect} from 'dva';
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Tooltip,Popconfirm,Popover,DatePicker} from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'
import {accAdd, accSub, accMul, accDiv} from '../../../common/Loopring/common/math'
import {configs} from '../../../common/config/data'
import config from '../../../common/config'
import Currency from '../../../modules/settings/CurrencyContainer'
import {getEstimatedAllocatedAllowance, getFrozenLrcFee} from '../../../common/Loopring/relay/utils'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'
import moment from 'moment'
import ReactDOM from 'react-dom'

class TradeForm extends React.Component {
  state = {
    priceInput: 0,
    amountInput:0,
    availableAmount: 0,
    timeToLivePatternSelect: 'easy',
    timeToLivePopularSetting: true,
    sliderMilliLrcFee:0,
    timeToLive:0,
    timeToLiveUnit:'',
    timeToLiveStart: null,
    timeToLiveEnd: null,
    total:0,
    loading: false,
  }

  render() {
    const tokenDivDigist = (token) => {
      const tokenCopy = {...token}
      tokenCopy.balance = tokenCopy.balance > 0 ? fm.toBig(tokenCopy.balance).div("1e"+tokenCopy.digits) : fm.toBig(0)
      tokenCopy.allowance = tokenCopy.allowance > 0 ? fm.toBig(tokenCopy.allowance).div("1e"+tokenCopy.digits) : fm.toBig(0)
      return tokenCopy
    }
    const _this = this
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const {form, dispatch, side = 'sell', pair = 'LRC-WETH',assets,prices,tickersByLoopring,tickersByPair,account,settings} = this.props
    const tickerByLoopring = tickersByLoopring.getTickerByMarket(pair)
    if(!config.isSupportedMarket(pair)) {
      Notification.open({
        type:'warning',
        message:intl.get('trade.not_supported_market_title'),
        description:intl.get('trade.not_supported_market_content', {market:pair})
      });
      window.routeActions.gotoPath('/trade/LRC-WETH')
      return null
    }
    const tokenL = pair.split('-')[0].toUpperCase()
    const tokenR = pair.split('-')[1].toUpperCase()
    const tokenLBalanceOriginal = {...config.getTokenBySymbol(tokenL), ...assets.getTokenBySymbol(tokenL)}
    const tokenLBalance = tokenDivDigist(tokenLBalanceOriginal)
    const tokenRBalanceOriginal = {...config.getTokenBySymbol(tokenR), ...assets.getTokenBySymbol(tokenR)}
    const tokenRBalance = tokenDivDigist(tokenRBalanceOriginal)
    const LrcBalanceOriginal = {...config.getTokenBySymbol('LRC'), ...assets.getTokenBySymbol('LRC')}
    const lrcBalance = tokenDivDigist(LrcBalanceOriginal)
    const marketConfig = window.CONFIG.getMarketBySymbol(tokenL, tokenR)
    const tokenRPrice = prices.getTokenBySymbol(tokenR)
    const integerReg = new RegExp("^[0-9]*$")
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")
    const TokenFormatter = window.uiFormatter.TokenFormatter
    let fmL = new TokenFormatter({symbol:tokenL})
    let fmR = new TokenFormatter({symbol:tokenR})
    let displayPrice = tickerByLoopring ? tickerByLoopring.last : 0
    displayPrice = fm.toNumber(fm.toFixed(displayPrice, marketConfig.pricePrecision))
    let availableAmount = 0
    if(side === 'sell') {
      availableAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
    } else {
      if(displayPrice >0) {
        availableAmount = Math.floor(tokenRBalance.balance / displayPrice * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
      }
    }
    const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
    if (amountPrecision > 0 && availableAmount !== 0) {
      availableAmount = fm.toNumber(fm.toFixed(availableAmount, amountPrecision))
    } else {
      availableAmount = Math.floor(availableAmount)
    }
    let sliderMilliLrcFee = this.state.sliderMilliLrcFee || settings.trading.lrcFee || configs.defaultLrcFeePermillage
    const total = accMul(this.state.priceInput > 0 ? this.state.priceInput : displayPrice, this.state.amountInput)
    let calculatedLrcFee = 0
    calculateLrcFee(total, sliderMilliLrcFee)
    let ttlInSecond = 0, ttlShow = ''
    if(this.state.timeToLivePatternSelect === 'easy') {
      const ttl = this.state.timeToLive ? Number(this.state.timeToLive) : Number(settings.trading.timeToLive)
      const unit = this.state.timeToLiveUnit ? this.state.timeToLiveUnit : settings.trading.timeToLiveUnit
      switch(unit){
        case 'minute': ttlInSecond = ttl * 60 ; ttlShow = `${ttl} ${intl.get('trade.minute')}`; break;
        case 'hour': ttlInSecond = ttl * 3600 ; ttlShow = `${ttl} ${intl.get('trade.hour')}`; break;
        case 'day': ttlInSecond = ttl * 86400; ttlShow = `${ttl} ${intl.get('trade.day')}`; break;
        case 'week': ttlInSecond = ttl * 7 * 86400; ttlShow = `${ttl} ${intl.get('trade.week')}`; break;
        case 'month': ttlInSecond = ttl * 30 * 86400; ttlShow = `${ttl} ${intl.get('trade.month')}`; break;
      }
    } else {
      if(this.state.timeToLiveStart && this.state.timeToLiveEnd) {
        ttlShow = `${this.state.timeToLiveStart.format("lll")} ~ ${this.state.timeToLiveEnd.format("lll")}`
      }
    }

    const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address'
    const lrcPrice = prices.getTokenBySymbol('LRC')

    const showModal = (payload)=>{
      dispatch({
        type: 'modals/modalChange',
        payload: {
          ...payload,
          visible: true,
        }
      })
    }

    const gotoError = (errors, e) => {
      if(e) e.stopPropagation()
      showModal({
        id: 'trade/place-order-error',
        errors,
      })
    }

    const showTradeModal = (tradeInfo) => {
      dispatch({
        type: 'modals/modalChange',
        payload: {
          id: 'trade/confirm',
          visible: true,
          side,
          pair,
          ...tradeInfo
        }
      })
    }

    const needUnlockCheck = () => {
      if(isWatchOnly) {
        dispatch({
          type:'modals/modalChange',
          payload:{
            id:'wallet/watchOnlyToUnlock',
            originalData:{},
            pageFrom:'TradeFrom',
            visible:true
          }
        })
      }
    }

    async function handleSubmit() {
      if(!window.WALLET_UNLOCK_TYPE) {
        return
      }
      if(isWatchOnly) {
        needUnlockCheck()
        return;
      }
      // if(!lrcBalance || lrcBalance.balance.lessThan(900)){
      //   if(window.CONFIG.getChainId() !== 7107171 && !await window.CONFIG.isinWhiteList(window.WALLET.getAddress())){
      //     Notification.open({
      //       type:'warning',
      //       message:intl.get('trade.not_inWhiteList'),
      //       description:intl.get('trade.not_allow')
      //     });
      //     return
      //   }
      // }
      form.validateFields((err, values) => {
        if (!err) {
          _this.setState({loading:true})
          const tradeInfo = {}
          tradeInfo.amount = Number(values.amount)
          tradeInfo.price = Number(values.price)
          tradeInfo.total = accMul(tradeInfo.amount, tradeInfo.price)
          // tradeInfo.timeToLive = ttlInSecond
          if(this.state.timeToLivePatternSelect === 'easy') {
            tradeInfo.validSince = moment().unix()
            tradeInfo.validUntil = moment().add(ttlInSecond, 'seconds').unix()
          } else {
            tradeInfo.validSince = this.state.timeToLiveStart.unix()
            tradeInfo.validUntil = this.state.timeToLiveEnd.unix()
          }
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          const totalWorth = calculateWorthInLegalCurrency(tokenR, tradeInfo.total)
          if(totalWorth <= 0) {
            Notification.open({
              message:intl.get('trade.send_failed'),
              description:intl.get('trade.failed_fetch_data'),
              type:'error'
            })
            _this.setState({loading:false})
            return
          }
          let allowed = false
          let priceSymbol = fm.getDisplaySymbol(settings.preference.currency)
          if(settings.preference.currency === 'USD') {
            priceSymbol = '100' + priceSymbol
            if(totalWorth > 100) {
              allowed = true
            }
          } else {
            priceSymbol = '500' + priceSymbol
            if(totalWorth > 500) {
              allowed = true
            }
          }
          if(!allowed) {
            Notification.open({
              message:intl.get('trade.not_allowed_place_order_worth_title'),
              description:intl.get('trade.not_allowed_place_order_worth_content', {worth: priceSymbol}),
              type:'error'
            })
            _this.setState({loading:false})
            return
          }
          tradeInfo.milliLrcFee = sliderMilliLrcFee
          tradeInfo.lrcFee = calculatedLrcFee
          toConfirm(tradeInfo, _this.props.txs)
        }
      });
    }

    function showConfirm(content, tradeInfo) {
      Modal.confirm({
        title: intl.get('trade.notice'),
        content: content,
        onOk: toConfirm.bind(this, tradeInfo),
        onCancel() {},
      });
    }

    function cutDecimal(number, decimail) {
      const d = new Number("1e"+decimail)
      return Math.floor(accMul(number, d)) / d
    }

    function ceilDecimal(number, decimail) {
      const d = new Number("1e"+decimail)
      return Math.ceil(accMul(number, d)) / d
    }

    async function toConfirm(tradeInfo,txs) {
      const configR = config.getTokenBySymbol(tokenR)
      const configL = config.getTokenBySymbol(tokenL)
      const ethBalance = fm.toBig(assets.getTokenBySymbol('ETH').balance).div(1e18)
      const approveGasLimit = config.getGasLimitByType('approve').gasLimit
      const frozenAmountLResult = await getEstimatedAllocatedAllowance(window.WALLET.getAddress(), tokenL)
      const frozenAmountRResult = await getEstimatedAllocatedAllowance(window.WALLET.getAddress(), tokenR)
      const lrcBalance = tokenDivDigist({...config.getTokenBySymbol('LRC'), ...assets.getTokenBySymbol('LRC')})
      let tokenBalanceS = null, tokenBalanceB = null
      let frozenAmountS = null
      if(side === 'buy') {//buy eos-weth
        tokenBalanceS = tokenRBalance
        tokenBalanceB = tokenLBalance
        frozenAmountS = fm.toBig(frozenAmountRResult.result).div('1e'+configR.digits).add(fm.toBig(tradeInfo.total))
      } else {//sell eos-weth
        tokenBalanceS = tokenLBalance
        tokenBalanceB = tokenRBalance
        frozenAmountS = fm.toBig(frozenAmountLResult.result).div('1e'+configL.digits).add(fm.toBig(tradeInfo.amount))
      }
      let approveCount = 0
      const warn = new Array()
      if(tokenBalanceB.symbol === 'LRC') { //buy lrc, only verify eth balance could cover gas cost if approve is needed
        if(tokenBalanceS.balance.lessThan(frozenAmountS)) {
          warn.push({type:"BalanceNotEnough", value:{symbol:tokenBalanceS.symbol, balance:cutDecimal(tokenBalanceS.balance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.balance).toNumber(),6)}})
        }
        const txAllowance = txs.isApproving(tokenBalanceS.symbol);
        const pendingAllowance = fm.toBig(txAllowance ? txAllowance.div('1e'+tokenBalanceS.digits):tokenBalanceS.allowance);
        if(frozenAmountS.greaterThan(pendingAllowance)) {
          warn.push({type:"AllowanceNotEnough", value:{symbol:tokenBalanceS.symbol, allowance:cutDecimal(pendingAllowance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.allowance).toNumber(),6)}})
          approveCount += 1
          if(pendingAllowance.greaterThan(0)) {approveCount += 1}
        }
        const gas = fm.toBig(settings.trading.gasPrice).times(fm.toNumber(approveGasLimit)).div(1e9).times(approveCount)
        if(ethBalance.lessThan(gas)){
          // const errors = new Array()
          // errors.push({type:"BalanceNotEnough", value:{symbol:'ETH', balance:cutDecimal(ethBalance.toNumber(),6), required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}})
          // gotoError(errors)
          Notification.open({
            message: intl.get('trade.send_failed'),
            description: intl.get('trade.eth_is_required', {required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}),
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive',symbol:'ETH'})}>{`${intl.get('tokens.options_receive')} ETH`}</Button>
              </div>
            )
          })
          _this.setState({loading:false})
          return
        }
      } else {
        //lrc balance not enough, lrcNeed = frozenLrc + lrcFee
        const frozenLrcFee = await getFrozenLrcFee(window.WALLET.getAddress())
        let frozenLrc = fm.toBig(frozenLrcFee.result).div(1e18).add(fm.toBig(tradeInfo.lrcFee))
        let failed = false
        if(lrcBalance.balance.lessThan(frozenLrc)){
          // const errors = new Array()
          // errors.push({type:"BalanceNotEnough", value:{symbol:'LRC', balance:cutDecimal(lrcBalance.balance.toNumber(), 6), required:ceilDecimal(frozenLrc.sub(lrcBalance.balance).toNumber(),6)}})
          // gotoError(errors)
          Notification.open({
            message: intl.get('trade.send_failed'),
            description: intl.get('trade.lrcfee_is_required', {required:ceilDecimal(frozenLrc.sub(lrcBalance.balance).toNumber(),6)}),
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive',symbol:'LRC'})}>{`${intl.get('tokens.options_receive')} LRC`}</Button>
              </div>
            )
          })
          failed = true
        }
        const frozenLrcInOrderResult = await getEstimatedAllocatedAllowance(window.WALLET.getAddress(), "LRC")
        frozenLrc = frozenLrc.add(fm.toBig(frozenLrcInOrderResult.result).div(1e18))
        if(tokenL === 'LRC' && side === 'sell') {// sell lrc-weth
          frozenLrc = frozenLrc.add(fm.toBig(tradeInfo.amount))
        }
        if(tokenR === 'LRC' && side === 'buy'){// buy eos-lrc
          frozenLrc = frozenLrc.add(fm.toBig(tradeInfo.total))
        }
        // verify tokenL/tokenR balance and allowance cause gas cost
        if(tokenBalanceS.symbol === 'LRC') {
          frozenAmountS = frozenLrc
        }
        if(tokenBalanceS.balance.lessThan(frozenAmountS)) {
          warn.push({type:"BalanceNotEnough", value:{symbol:tokenBalanceS.symbol, balance:cutDecimal(tokenBalanceS.balance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.balance).toNumber(),6)}})
        }
        const pendingAllowance = fm.toBig(txs.isApproving(tokenBalanceS.symbol) ? txs.isApproving(tokenBalanceS.symbol).div('1e'+tokenBalanceS.digits) : tokenBalanceS.allowance);
        if(pendingAllowance.lessThan(frozenAmountS)) {
          warn.push({type:"AllowanceNotEnough", value:{symbol:tokenBalanceS.symbol, allowance:cutDecimal(pendingAllowance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.allowance).toNumber(),6)}})
          approveCount += 1
          if(pendingAllowance.greaterThan(0)) approveCount += 1
        }
        // lrcFee allowance
        const pendingLRCAllowance = fm.toBig(txs.isApproving('LRC') ? txs.isApproving('LRC').div(1e18):lrcBalance.allowance);
        if(frozenLrc.greaterThan(pendingLRCAllowance) && tokenBalanceS.symbol !== 'LRC') {
          warn.push({type:"AllowanceNotEnough", value:{symbol:"LRC", allowance:cutDecimal(pendingLRCAllowance.toNumber(),6), required:ceilDecimal(frozenLrc.sub(lrcBalance.allowance).toNumber(),6)}})
          approveCount += 1
          if(pendingLRCAllowance.greaterThan(0)) approveCount += 1
        }
        const gas = fm.toBig(settings.trading.gasPrice).times(approveGasLimit).div(1e9).times(approveCount)
        if(ethBalance.lessThan(gas)){
          // const errors = new Array()
          // errors.push({type:"BalanceNotEnough", value:{symbol:'ETH', balance:cutDecimal(ethBalance.toNumber(),6), required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}})
          // gotoError(errors)
          Notification.open({
            message: intl.get('trade.send_failed'),
            description: intl.get('trade.eth_is_required', {required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}),
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive',symbol:'ETH'})}>{`${intl.get('tokens.options_receive')} ETH`}</Button>
              </div>
            )
          })
          failed = true
        }
        if(failed) {
          _this.setState({loading:false})
          return
        }
      }
      tradeInfo.warn = warn
      _this.setState({loading:false});
      showTradeModal(tradeInfo)
    }

    function calculateWorthInLegalCurrency(symbol, amount) {
      const price = prices.getTokenBySymbol(symbol).price
      return accMul(amount, price)
    }

    function calculateLrcFeeInEth(totalWorth, milliLrcFee) {
      const price = prices.getTokenBySymbol("eth").price
      return accDiv(accDiv(accMul(totalWorth, milliLrcFee), 1000), price)
    }

    function calculateLrcFeeInLrc(totalWorth) {
      const price = prices.getTokenBySymbol("lrc").price
      return accDiv(Math.floor(accMul(accDiv(totalWorth, price), 100)), 100)
    }

    function calculateLrcFeeByEth(ethAmount) {
      const ethPrice = prices.getTokenBySymbol("eth").price
      const lrcPrice = prices.getTokenBySymbol("lrc").price
      const price = accDiv(lrcPrice, ethPrice)
      return accDiv(Math.floor(accMul(accDiv(ethAmount, price), 100)), 100)
    }

    function handleCancle() {
    }

    function handleReset() {
      form.resetFields()
    }

    function validateAmount(value) {
      // const amount = Number(value)
      // const price = Number(form.getFieldValue("price"))
      // if (amount <= 0) return false
      // if (side === 'sell') {
      //   return amount <= tokenLBalance.balance
      // } else {
      //   if (price > 0) {
      //     return accMul(price, amount) <= tokenRBalance.balance
      //   } else {
      //     return true
      //   }
      // }
      return value > 0
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    function validateLrcFee(value) {
      if (value) {
        const v = Number(value)
        return v > 0 && v <= 50
      } else {
        return true
      }
    }

    function validateMarginSplit(value) {
      if (value) {
        const v = Number(value)
        return v >= 0 && v <= 100
      } else {
        return true
      }
    }

    function validateOptionInteger(value) {
      if (value) {
        return integerReg.test(value)
      } else {
        return true
      }
    }

    function calculateLrcFee(total, milliLrcFee) {
      const totalWorth = calculateWorthInLegalCurrency(tokenR, total)
      if(totalWorth <= 0) {
        calculatedLrcFee = 0
        return
      }
      if (!milliLrcFee) {
        milliLrcFee = Number(configs.defaultLrcFeePermillage)
      }
      let userSetLrcFeeInEth = calculateLrcFeeInEth(totalWorth, milliLrcFee)
      const minimumLrcfeeInEth = configs.minimumLrcfeeInEth
      if(userSetLrcFeeInEth >= minimumLrcfeeInEth){
        calculatedLrcFee = calculateLrcFeeByEth(userSetLrcFeeInEth)
      } else {
        calculatedLrcFee = calculateLrcFeeByEth(minimumLrcfeeInEth)
      }
    }

    function inputChange(type, e) {
      let price = 0, amount = 0
      if (type === 'price') {
        price = e.target.value.toString()
        if (!amountReg.test(price)) return false
        const priceArr = price.split(".")
        if(priceArr.length === 2 && priceArr[1].length > marketConfig.pricePrecision){
          price = fm.toNumber(fm.toFixed(fm.toNumber(price), marketConfig.pricePrecision))
        }
        e.target.value = price
        this.setState({priceInput: price})
        amount = Number(form.getFieldValue("amount"))
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if (!amountReg.test(amount)) return false
        const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
        if (amountPrecision > 0) {
          amount = fm.toNumber(fm.toFixed(fm.toNumber(amount), amountPrecision))
        } else {
          amount = Math.floor(amount)
        }
        e.target.value = amount
        this.setState({amountInput: amount})
        price = Number(form.getFieldValue("price"))
      }
      let avalAmount = 0
      if(side === 'buy'){
        if(price >0){
          const precision = Math.max(0,tokenRBalance.precision - marketConfig.pricePrecision)
          avalAmount = Math.floor(tokenRBalance.balance / Number(price) * ("1e"+precision)) / ("1e"+precision)
          this.setState({availableAmount: avalAmount})
        }
      } else {
        avalAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
        this.setState({availableAmount: avalAmount})
      }
      let ratio = 0
      if(avalAmount > 0) {
        if(amount >= avalAmount) {
          ratio = 100
        } else {
          ratio = Math.floor(accMul(100,accDiv(amount, avalAmount)))
        }
      }
      form.setFieldsValue({"amountSlider":ratio})
      const total = accMul(price, amount)
      this.setState({total: total})
      //LRC Fee
      calculateLrcFee(total, sliderMilliLrcFee)
    }

    function timeToLiveChange(e) {
      e.preventDefault();
      this.setState({timeToLivePopularSetting: !this.state.timeToLivePopularSetting})
    }

    function amountSliderChange(e) {
      const value = this.state.availableAmount ? this.state.availableAmount : availableAmount
      if(value > 0) {
        let amount = accMul(value, Number(e)) / 100
        const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
        if (amountPrecision > 0) {
          amount = fm.toFixed(amount, amountPrecision)
        } else {
          amount = Math.floor(amount)
        }
        form.setFieldsValue({"amount": amount})
        const price = Number(form.getFieldValue("price"))
        let total = accMul(price, amount)
        this.setState({priceInput: price, amountInput: amount, total: total})
      }
    }

    function lrcFeeChange(v) {
      const milliLrcFee = v
      _this.setState({sliderMilliLrcFee : milliLrcFee})
      const amount = Number(form.getFieldValue("amount"))
      const price = Number(form.getFieldValue("price"))
      if(amount && price) {
        const total = accMul(price, amount)
        calculateLrcFee(total, milliLrcFee)
      }
    }

    // function timeToLiveValueChange(type, e) {
    //   if(type === 'popular') {
    //     const ttl = e.target.value
    //     switch(ttl){
    //       case '1hour': _this.setState({timeToLive: 1, timeToLiveUnit: 'hour'}); break;
    //       case '1day': _this.setState({timeToLive: 1, timeToLiveUnit: 'day'});  break;
    //       case '1week': _this.setState({timeToLive: 1, timeToLiveUnit: 'week'}); break;
    //       case '1month': _this.setState({timeToLive: 1, timeToLiveUnit: 'month'}); break;
    //     }
    //   } else {
    //     if(type === 'moreUnit') {
    //       const ttl = form.getFieldValue('timeToLive')
    //       const unit = e
    //       _this.setState({timeToLive: ttl, timeToLiveUnit: unit})
    //     }
    //     if(type === 'moreValue') {
    //       const ttl = e.target.value
    //       const unit = form.getFieldValue('timeToLiveUnit')
    //       _this.setState({timeToLive: ttl, timeToLiveUnit: unit})
    //     }
    //   }
    // }

    function timeToLiveValueChange(type, e) {
      if(type === 'popular') {
        const ttl = e.target.value
        switch (ttl) {
          case '1hour':
            _this.setState({timeToLivePopularSetting: true, timeToLive: 1, timeToLiveUnit: 'hour'});
            break;
          case '1day':
            _this.setState({timeToLivePopularSetting: true, timeToLive: 1, timeToLiveUnit: 'day'});
            break;
          case '1week':
            _this.setState({timeToLivePopularSetting: true, timeToLive: 1, timeToLiveUnit: 'week'});
            break;
          case '1month':
            _this.setState({timeToLivePopularSetting: true, timeToLive: 1, timeToLiveUnit: 'month'});
            break;
          case 'more':
            _this.setState({timeToLivePopularSetting: false});
            break;
        }
      } else {
        if (type === 'moreUnit') {
          const ttl = form.getFieldValue('timeToLive')
          const unit = e
          _this.setState({timeToLive: ttl, timeToLiveUnit: unit})
        }
        if (type === 'moreValue') {
          const ttl = e.target.value
          const unit = form.getFieldValue('timeToLiveUnit')
          _this.setState({timeToLive: ttl, timeToLiveUnit: unit})
        }
      }
    }

    function timeToLivePatternChanged(value) {
      _this.setState({timeToLivePatternSelect: value})
      if(value === 'advance') {
        const timeToLiveTimeSelector = form.getFieldValue('timeToLiveTimeSelector')
        if(timeToLiveTimeSelector.length === 2) {
          _this.setState({timeToLiveStart: timeToLiveTimeSelector[0], timeToLiveEnd: timeToLiveTimeSelector[1]})
        }
      }
    }

    function timeToLiveTimeSelected(value) {
      if(value.length === 2) {
        _this.setState({timeToLiveStart: value[0], timeToLiveEnd: value[1]})
      }
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };

    const contentItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    const selectChanged = (e) => {
      console.log(e);
      e.stopPropagation();
    }

    const Option = Select.Option;
    const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
      initialValue: "minute",
      rules: []
    })(
      <Select style={{width: 90}} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={timeToLiveValueChange.bind(this, 'moreUnit')}>
        <Option value="minute">{intl.get('trade.minute')}</Option>
        <Option value="hour">{intl.get('trade.hour')}</Option>
        <Option value="day">{intl.get('trade.day')}</Option>
      </Select>
    )

    const marks = {
      0: '0',
      25: '25％',
      50: '50％',
      75: '75％',
      100: '100％'
    };

    const amountSlider = form.getFieldDecorator('amountSlider', {
      initialValue: 0,
      rules: []
    })(
      <Slider className="place-order-amount-percentage" min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)}
              tipFormatter={null} disabled={availableAmount === 0 && this.state.availableAmount <= 0}/>
    )
    const priceValue = (
      <span className="fs12">
        <Currency />
        {this.state.priceInput >0 ? accMul(this.state.priceInput, tokenRPrice.price).toFixed(2) : accMul(displayPrice, tokenRPrice.price).toFixed(2)}
      </span>
    )
    const totalPrice = (
      <span className="">
        <Currency />
        {this.state.total >0 ? accMul(this.state.total, tokenRPrice.price).toFixed(2) : 0}
      </span>
    )
    const lrcFeeWorth = (
      <span className="">
        <Currency />
        {calculatedLrcFee > 0 ? accMul(calculatedLrcFee, lrcPrice.price).toFixed(2) : 0}
      </span>
    )
    const editLRCFee = (
      <Popover overlayClassName="place-order-form-popover" title={<div className="pt5 pb5">{intl.get('trade.custom_lrc_fee_title')}</div>} content={
        <div>
          <div className="pb5 fs12">{intl.get('trade.current_lrc_fee_ratio')} : {sliderMilliLrcFee}‰</div>
          <div className="pb15 fs12">{intl.get('trade.current_lrc_fee')} : {calculatedLrcFee} LRC</div>
          {form.getFieldDecorator('lrcFeeSlider', {
            initialValue: configs.defaultLrcFeePermillage,
            rules: []
            })(
              <Slider min={1} max={50} step={1}
                  marks={{
                    1: intl.get('token.slow'),
                    50: intl.get('token.fast')
                  }}
                  onChange={lrcFeeChange.bind(this)}
              />
          )}
        </div>
      } trigger="click">
        <a className="fs12 pointer color-black-3">{intl.get('global.custom')}<Icon type="right" /></a>
      </Popover>
    )
    let outTokenBalance = 0
    const customPanelStyle = {
      background: '#fff',
      borderRadius: 4,
      border: 'none',
      overflow: 'hidden',
    };
    const editOrderTTLPattern = (
      <Popover overlayClassName="place-order-form-popover p0" ref="popover"
               title={null &&<div className="pt5 pb5">{intl.get('trade.custom_time_to_live_title')}</div>}
               content={
                 <div style={{width:'382px'}}>
                   <Collapse accordion style={customPanelStyle} defaultActiveKey={['easy']} onChange={timeToLivePatternChanged}>
                     <Collapse.Panel header={intl.get('trade.order_ttl_expire_in')} key="easy">
                       <div className="pt5 pb5">
                           <Form.Item className="ttl mb0" colon={false} label={null}>
                             {form.getFieldDecorator('timeToLivePopularSetting')(
                               <Radio.Group onChange={timeToLiveValueChange.bind(this, 'popular')}>
                                 <Radio className="mb5" value="1hour">1 {intl.get('trade.hour')}</Radio>
                                 <Radio className="mb5" value="1day">1 {intl.get('trade.day')}</Radio>
                                 <Radio className="mb5" value="1week">1 {intl.get('trade.week')}</Radio>
                                 <Radio className="mb5" value="1month">1 {intl.get('trade.month')}</Radio>
                                 <Radio className="mb5" value="more">{intl.get('trade.more')}</Radio>
                               </Radio.Group>
                             )}
                           </Form.Item>
                           {!this.state.timeToLivePopularSetting &&
                           <Form.Item className="mb0 d-block ttl" colon={false} label={null}>
                             {form.getFieldDecorator('timeToLive', {
                               rules: [{
                                 message: intl.get('trade.integer_verification_message'),
                                 validator: (rule, value, cb) => validateOptionInteger(value) ? cb() : cb(true)
                               }]
                             })(
                               <Input className="d-block w-100" placeholder={intl.get('trade.time_to_live_input_place_holder')} size="large" addonAfter={timeToLiveSelectAfter}
                                      onChange={timeToLiveValueChange.bind(this, 'moreValue')}/>
                             )}
                           </Form.Item>}
                         </div>
                     </Collapse.Panel>
                     <Collapse.Panel header={intl.get('trade.order_ttl_from_to')} key="advance">
                       <Form.Item className="mb5 ttl" colon={false} label={null}>
                         {form.getFieldDecorator('timeToLiveTimeSelector', {
                           initialValue:[moment(), moment().add(1, 'days')]
                         })(
                           <DatePicker.RangePicker
                             locale={settings.preference.language}
                             getCalendarContainer={trigger =>
                             {
                               // return trigger.parentNode.parentNode.parentNode
                               return ReactDOM.findDOMNode(this.refs.popover);
                             }

                             }
                             showTime={{ format: 'HH:mm' }}
                             format="YYYY-MM-DD HH:mm"
                             placeholder={['Start Time', 'End Time']}
                             onChange={timeToLiveTimeSelected}
                           />
                         )}
                       </Form.Item>
                     </Collapse.Panel>
                   </Collapse>
                 </div>
               } trigger="click">
        <a className="fs12 pointer color-black-3">{intl.get('global.custom')}<Icon type="right" /></a>
      </Popover>
    )
    let outTokenSymbol
    if(side === 'buy'){
      outTokenBalance = fmR.getAmount(tokenRBalanceOriginal.balance)
      outTokenSymbol = tokenR
    }else{
      outTokenBalance = fmL.getAmount(tokenLBalanceOriginal.balance)
      outTokenSymbol = tokenL
    }

    return (
      <div className="place-order-form">
        <Form layout="horizontal" className="">
          {
            false &&
            <div className="row gutter-0 zb-b-b lh25 align-items-center">
              <div className="col">
                <div className="fs2 lh25 color-black-1 pt10 pb10 pl10 zb-b-b">
                  {intl.get('trade.buy')} {tokenL}
                </div>
              </div>
              <div className="col-auto fs12 color-black-2 pr10">
                {outTokenSymbol} {intl.get('trade.balance')} {outTokenBalance}
              </div>
            </div>
          }
          <div className="pl10 pr10 pt10">
            <div className="row ml0 mr0">
              <div className="col fs12 color-black-1">
                {intl.get('trade.price')}
                <span className="color-black-3 ml5">
                  {priceValue}
                </span>
              </div>
              <div className="col-auto fs12 color-black-2">
              </div>
            </div>
            <Form.Item className="mb15" label={null} colon={false}>
              {form.getFieldDecorator('price', {
                initialValue: displayPrice,
                rules: [{
                  message: intl.get('trade.price_verification_message'),
                  validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
                }]
              })(
                <Input className="d-block w-100 fs3" placeholder="" size="large"
                       prefix={null && <span className="addon-before fs3 color-black-2">{intl.get('trade.price')}</span>}
                       suffix={<span className="fs14 color-black-4">{tokenR}</span>}
                       onChange={inputChange.bind(this, 'price')}
                       onFocus={() => {
                         const amount = form.getFieldValue("price")
                         if (amount === 0) {
                           form.setFieldsValue({"price": ''})
                         }
                       }}
                       onBlur={() => {
                         const amount = form.getFieldValue("price")
                         if (amount === '') {
                           form.setFieldsValue({"price": 0})
                         }
                       }}/>
              )}

            </Form.Item>
            <div className="row ml0 mr0">
              <div className="col fs12 color-black-2">
                {intl.get('trade.amount')}
                <span className="color-black-3 fs12 ml5">
                  {this.state.availableAmount >0 ? this.state.availableAmount : availableAmount}
                  &nbsp;{intl.get('trade.available')}
                </span>
              </div>
              <div className="col-auto fs12 color-black-2">
              </div>
            </div>
            <Form.Item className="mb15" label={null} colon={false} extra={
              <div>
                <div className="" style={{marginBottom:"-10px"}}>{amountSlider}</div>
              </div>
            }>
              {form.getFieldDecorator('amount', {
                initialValue: 0,
                rules: [{
                  message: intl.get('trade.amount_verification_message'),
                  validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                }]
              })(
                <Input  className="d-block w-100 fs3" placeholder="" size="large"
                      prefix={null && <span className="addon-before fs3 color-black-2">{intl.get('trade.amount')}</span>}
                      suffix={<span className="fs14 color-black-4">{tokenL}</span>} onChange={inputChange.bind(this, 'amount')}
                       onFocus={() => {
                         const amount = Number(form.getFieldValue("amount"))
                         if (amount === 0) {
                           form.setFieldsValue({"amount": ''})
                         }
                       }}
                       onBlur={() => {
                         const amount = form.getFieldValue("amount")
                         if (amount === '') {
                           form.setFieldsValue({"amount": 0})
                         }
                       }}/>
              )}
            </Form.Item>
          </div>
          <div className="zb-b-b">
            <div className="row align-items-center ml0 mr0 pl10 pr10 lh40 zb-b-t">
              <div className="col-auto fs12 color-black-1">
                {intl.get('trade.total')}&nbsp;:&nbsp;&nbsp;
              </div>
              <div className={`col-auto font-weight-bold fs12 color-black-1`}>
                {`${this.state.total} ${tokenR}`} ≈ {totalPrice}
              </div>
              <div className="col"></div>
              <div className="col-auto fs12 color-black-3">
                {
                  outTokenSymbol === tokenR &&
                  <div>
                    {outTokenSymbol}&nbsp;{intl.get('trade.balance')}&nbsp;{outTokenBalance}
                  </div>
                }
              </div>
            </div>

            <div className="row align-items-center ml0 mr0 pl10 pr10 lh40 zb-b-t">

              <div className="col-auto fs12 color-black-1">
                <Tooltip title={intl.getHTML('trade.tips_lrc_fee')}>
                {intl.get('trade.lrc_fee')}
                &nbsp;:&nbsp;&nbsp;
                <span className={`font-weight-bold fs12 color-black-1`}>{calculatedLrcFee} LRC ≈ {lrcFeeWorth}</span>
                </Tooltip>
              </div>
              <div className="col"></div>
              <div className="col-auto pl0 pr0">{editLRCFee}</div>
            </div>


            <div className="row align-items-center ml0 mr0 pl10 pr10 lh40 zb-b-t">
              <div className="col-auto fs12 color-black-1">
                <Tooltip title={intl.getHTML('trade.tips_time_to_live')}>
                {this.state.timeToLivePatternSelect === 'easy' && intl.get('trade.time_to_live')}
                  {this.state.timeToLivePatternSelect === 'advance' && intl.get('trade.time_to_live_advance')}
                &nbsp;:&nbsp;&nbsp;
                <span className={`col-auto font-weight-bold fs12 color-black-1`}>{ttlShow}</span>
                </Tooltip>
              </div>
              <div className="col"></div>
              <div className="col-auto pl0 pr0">{editOrderTTLPattern}</div>
            </div>

          </div>
          <div className="pl10 pr10 pt15 pb15">
            {account && account.isUnlocked && window.WALLET_UNLOCK_TYPE === 'Trezor' &&
              <div className="bg-blue-grey-50 text-center pt15 pb15" style={{borderRadius:'4px'}}>
                {intl.get('trade.place_order_trezor_unsupport') }
                <Tooltip title={intl.getHTML('trade.place_order_trezor_unsupport_tips')}>
                  <Icon className="color-grey-500 mr10" type="question-circle"/>
                </Tooltip>
              </div>
            }
            {account && account.isUnlocked && window.WALLET_UNLOCK_TYPE && window.WALLET_UNLOCK_TYPE !== 'Trezor' &&
            <Form.Item className="mb0">
              {
                side == 'buy' &&
                <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-green-500 border-none color-white"
                        size="large" loading={this.state.loading}>
                  {intl.get('trade.place_order')}
                </Button>
              }
              {
                side == 'sell' &&
                <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-red-500 border-none color-white"
                        size="large" loading={this.state.loading}>
                  {intl.get('trade.place_order')}
                </Button>
              }
            </Form.Item>
            }
            {(!account || !account.isUnlocked) &&
              <Form.Item className="mb0">
              {
                side == 'buy' &&
                <Button onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'TradeFrom',targetModalData: {}})} type="" className="d-block w-100 bg-green-500 border-none color-white"
                        size="large">
                  {intl.get('trade.unlock_your_wallet')} {intl.get('trade.to_trade')}
                </Button>
              }
              {
                side == 'sell' &&
                <Button onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'TradeFrom',targetModalData: {}})} type="" className="d-block w-100 bg-red-500 border-none color-white"
                        size="large">
                  {intl.get('trade.unlock_your_wallet')} {intl.get('trade.to_trade')}
                </Button>
              }
              </Form.Item>
            }
          </div>


        </Form>
      </div>
    );
  };
}

export default Form.create()(connect()(TradeForm));
