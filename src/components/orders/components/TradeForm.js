import React from 'react';
import {connect} from 'dva';
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Tooltip,Popconfirm} from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'
import {accAdd, accSub, accMul, accDiv} from '../../../common/Loopring/common/math'
import {configs} from '../../../common/config/data'
import config from '../../../common/config'
import Currency from '../../../modules/settings/CurrencyContainer'
import {getEstimatedAllocatedAllowance, getFrozenLrcFee} from '../../../common/Loopring/relay/utils'
import intl from 'react-intl-universal';
import Notification from 'Loopr/Notification'

class TradeForm extends React.Component {
  state = {
    priceInput: 0,
    amountInput:0,
    availableAmount: 0,
    timeToLivePopularSetting: true,
    sliderMilliLrcFee:0,
    timeToLive:0,
    timeToLiveUnit:'',
    total:0
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
    const tokenL = pair.split('-')[0].toUpperCase()
    const tokenR = pair.split('-')[1].toUpperCase()
    const tokenLBalanceOriginal = {...config.getTokenBySymbol(tokenL), ...assets.getTokenBySymbol(tokenL)}
    const tokenLBalance = tokenDivDigist(tokenLBalanceOriginal)
    const tokenRBalanceOriginal = {...config.getTokenBySymbol(tokenR), ...assets.getTokenBySymbol(tokenR)}
    const tokenRBalance = tokenDivDigist(tokenRBalanceOriginal)
    const marketConfig = window.CONFIG.getMarketBySymbol(tokenL, tokenR)
    const tokenRPrice = prices.getTokenBySymbol(tokenR)
    const integerReg = new RegExp("^[0-9]*$")
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")
    const TokenFormatter = window.uiFormatter.TokenFormatter
    let fmL = new TokenFormatter({symbol:tokenL})
    let fmR = new TokenFormatter({symbol:tokenR})
    let displayPrice = tickerByLoopring ? tickerByLoopring.last : 0
    const priceArr = displayPrice.toString().split(".")
    if (priceArr[1] && priceArr[1].length > marketConfig.pricePrecision) {
      try {
        displayPrice = Number(priceArr[0] + "." + priceArr[1].substring(0, marketConfig.pricePrecision))
      } catch (e) {
        console.error(e)
        displayPrice = 0
      }
    }
    let availableAmount = 0
    if(side === 'sell') {
      availableAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
    } else {
      if(displayPrice >0) {
        availableAmount = Math.floor(tokenRBalance.balance / Number(displayPrice) * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
      }
    }
    const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
    if (amountPrecision > 0) {
      const amountArr = availableAmount.split(".")
      if (amountArr[1] && amountArr[1].length > amountPrecision) {
        try {
          availableAmount = Number(amountArr[0] + "." + amountArr[1].substring(0, amountPrecision))
        } catch (e) {
          console.error(e)
          availableAmount = 0
        }
      }
    } else {
      availableAmount = Math.floor(availableAmount)
    }
    let sliderMilliLrcFee = this.state.sliderMilliLrcFee || settings.trading.lrcFee || configs.defaultLrcFeePermillage
    const total = accMul(this.state.priceInput > 0 ? this.state.priceInput : displayPrice, this.state.amountInput)
    let calculatedLrcFee = 0
    calculateLrcFee(total, sliderMilliLrcFee)
    let ttlInSecond = 0, ttlShow = ''
    const ttl = this.state.timeToLive ? Number(this.state.timeToLive) : Number(settings.trading.timeToLive)
    const unit = this.state.timeToLiveUnit ? this.state.timeToLiveUnit : settings.trading.timeToLiveUnit
    switch(unit){
      case 'minute': ttlInSecond = ttl * 60 ; ttlShow = `${ttl} ${intl.get('trade.minute')}`; break;
      case 'hour': ttlInSecond = ttl * 3600 ; ttlShow = `${ttl} ${intl.get('trade.hour')}`; break;
      case 'day': ttlInSecond = ttl * 24 * 86400; ttlShow = `${ttl} ${intl.get('trade.day')}`; break;
      case 'week': ttlInSecond = ttl * 7 * 24 * 86400; ttlShow = `${ttl} ${intl.get('trade.week')}`; break;
      case 'month': ttlInSecond = ttl * 30 * 24 * 86400; ttlShow = `${ttl} ${intl.get('trade.month')}`; break;
    }
    const isWatchOnly = window.WALLET_UNLOCK_TYPE === 'Address'

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

    function handleSubmit() {
      if(!window.WALLET_UNLOCK_TYPE) {
        return
      }
      form.validateFields((err, values) => {
        if (!err) {
          const tradeInfo = {}
          tradeInfo.amount = Number(values.amount)
          tradeInfo.price = Number(values.price)
          tradeInfo.total = accMul(tradeInfo.amount, tradeInfo.price)
          tradeInfo.timeToLive = ttlInSecond
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
            return
          }
          tradeInfo.milliLrcFee = sliderMilliLrcFee
          tradeInfo.lrcFee = calculatedLrcFee
          toConfirm(tradeInfo)
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

    async function toConfirm(tradeInfo) {
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
        if(frozenAmountS.greaterThan(tokenBalanceS.allowance)) {
          warn.push({type:"AllowanceNotEnough", value:{symbol:tokenBalanceS.symbol, allowance:cutDecimal(tokenBalanceS.allowance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.allowance).toNumber(),6)}})
          approveCount += 1
          if(tokenBalanceS.allowance.greaterThan(0)) approveCount += 1
        }
        const gas = fm.toBig(settings.trading.gasPrice).times(fm.toNumber(approveGasLimit)).div(1e9).times(approveCount)
        if(ethBalance.lessThan(gas)){
          // const errors = new Array()
          // errors.push({type:"BalanceNotEnough", value:{symbol:'ETH', balance:cutDecimal(ethBalance.toNumber(),6), required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}})
          // gotoError(errors)
          Notification.open({
            message: intl.get('trade.send_failed'),
            description: `${intl.get('trade.eth_is_required')}, ${intl.get('trade.balance_not_enough', {token:'ETH',required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)})}`,
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive'})}>{`${intl.get('tokens.options_receive')} ETH`}</Button>
              </div>
            )
          })
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
            description: `${intl.get('trade.lrcfee_is_required')}, ${intl.get('trade.balance_not_enough', {token:'LRC',required:ceilDecimal(frozenLrc.sub(lrcBalance.balance).toNumber(),6)})}`,
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive'})}>{`${intl.get('tokens.options_receive')} LRC`}</Button>
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
        if(tokenBalanceS.allowance.lessThan(frozenAmountS)) {
          warn.push({type:"AllowanceNotEnough", value:{symbol:tokenBalanceS.symbol, allowance:cutDecimal(tokenBalanceS.allowance.toNumber(),6), required:ceilDecimal(frozenAmountS.sub(tokenBalanceS.allowance).toNumber(),6)}})
          approveCount += 1
          if(tokenBalanceS.allowance.greaterThan(0)) approveCount += 1
        }
        // lrcFee allowance
        if(frozenLrc.greaterThan(lrcBalance.allowance) && tokenBalanceS.symbol !== 'LRC') {
          warn.push({type:"AllowanceNotEnough", value:{symbol:"LRC", allowance:cutDecimal(lrcBalance.allowance.toNumber(),6), required:ceilDecimal(frozenLrc.sub(lrcBalance.allowance).toNumber(),6)}})
          approveCount += 1
          if(lrcBalance.allowance.greaterThan(0)) approveCount += 1
        }
        const gas = fm.toBig(settings.trading.gasPrice).times(approveGasLimit).div(1e9).times(approveCount)
        if(ethBalance.lessThan(gas)){
          // const errors = new Array()
          // errors.push({type:"BalanceNotEnough", value:{symbol:'ETH', balance:cutDecimal(ethBalance.toNumber(),6), required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)}})
          // gotoError(errors)
          Notification.open({
            message: intl.get('trade.send_failed'),
            description: `${intl.get('trade.eth_is_required')}, ${intl.get('trade.balance_not_enough', {token:'ETH',required:ceilDecimal(gas.sub(ethBalance).toNumber(),6)})}`,
            type:'error',
            actions:(
              <div>
                <Button className="alert-btn mr5" onClick={showModal.bind(this,{id:'token/receive'})}>{`${intl.get('tokens.options_receive')} ETH`}</Button>
              </div>
            )
          })
          failed = true
        }
        if(failed) {
          return
        }
      }
      if(warn.length >0) {
        tradeInfo.warn = warn
      }
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
        if (priceArr[1] && priceArr[1].length > marketConfig.pricePrecision) {
          try {
            price = Number(priceArr[0] + "." + priceArr[1].substring(0, marketConfig.pricePrecision))
          } catch (e) {
            console.error(e)
            price = 0
          }
          e.target.value = price
        }
        this.setState({priceInput: price})
        amount = Number(form.getFieldValue("amount"))
        if(side === 'buy'){
          const precision = Math.max(0,tokenRBalance.precision - marketConfig.pricePrecision)
          const availableAmount = Math.floor(tokenRBalance.balance / Number(price) * ("1e"+precision)) / ("1e"+precision)
          this.setState({availableAmount: availableAmount})
          form.setFieldsValue({"amountSlider":0})
        } else {
          const availableAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
          this.setState({availableAmount: availableAmount})
        }
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if (!amountReg.test(amount)) return false
        const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
        if (amountPrecision > 0) {
          const amountArr = amount.split(".")
          if (amountArr[1] && amountArr[1].length > amountPrecision) {
            try {
              amount = Number(amountArr[0] + "." + amountArr[1].substring(0, amountPrecision))
            } catch (e) {
              console.error(e)
              amount = 0
            }
          }
        } else {
          amount = Math.floor(amount)
        }
        e.target.value = amount
        this.setState({amountInput: amount})
        price = Number(form.getFieldValue("price"))
      }
      const total = accMul(price, amount)
      // form.setFieldsValue({"total": total})
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
          const amountArr = amount.split(".")
          if (amountArr[1] && amountArr[1].length > amountPrecision) {
            try {
              amount = Number(amountArr[0] + "." + amountArr[1].substring(0, amountPrecision))
            } catch (e) {
              console.error(e)
              amount = 0
            }
          }
        } else {
          amount = Math.floor(amount)
        }
        form.setFieldsValue({"amount": amount})
        const price = Number(form.getFieldValue("price"))
        const total = accMul(price, amount)
        // form.setFieldsValue({"total": total})
        this.setState({priceInput: price, amountInput: amount, total: total})
      }
    }

    function lrcFeeChange(v) {

    }

    function lrcFeeConfirm() {
      const milliLrcFee = form.getFieldValue('lrcFeeSlider')
      _this.setState({sliderMilliLrcFee : milliLrcFee})
      const amount = Number(form.getFieldValue("amount"))
      const price = Number(form.getFieldValue("price"))
      if(amount && price) {
        const total = accMul(price, amount)
        calculateLrcFee(total, milliLrcFee)
      }
    }

    function ttlConfirm() {
      if(this.state.timeToLivePopularSetting) {
        const ttl = form.getFieldValue('timeToLivePopularSetting')
        switch(ttl){
          case '1hour': _this.setState({timeToLive: 1, timeToLiveUnit: 'hour'}); break;
          case '1day': _this.setState({timeToLive: 1, timeToLiveUnit: 'day'});  break;
          case '1week': _this.setState({timeToLive: 1, timeToLiveUnit: 'week'}); break;
          case '1month': _this.setState({timeToLive: 1, timeToLiveUnit: 'month'}); break;
        }
      } else {
        const ttl = form.getFieldValue('timeToLive')
        const unit = form.getFieldValue('timeToLiveUnit')
        _this.setState({timeToLive: ttl, timeToLiveUnit: unit})
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
      <Select style={{width: 90}} getPopupContainer={triggerNode => triggerNode.parentNode}>
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
      <Slider className="place-order-amount-percentage" min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)} disabled={availableAmount === 0 && this.state.availableAmount <= 0}/>
    )
    const priceValue = (
      <span className="fs10">
        ≈
        <Currency />
        {this.state.priceInput >0 ? accMul(this.state.priceInput, tokenRPrice.price).toFixed(2) : accMul(displayPrice, tokenRPrice.price).toFixed(2)}
      </span>
    )
    const editLRCFee = (
      <Popconfirm title={
        <div>
          <div>{intl.get('trade.custom_option_fee')}</div>
          <div>
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
        </div>
      } okText="Yes" cancelText="No" onConfirm={lrcFeeConfirm.bind(this)}>
        <Tooltip title="Advance Setting">
        <a className="fs12 pointer color-black-3 mr5"><Icon type="edit" /></a>
        </Tooltip>
      </Popconfirm>
    )
    const editOrderTTL = (
      <Popconfirm title={
        <div>
          {this.state.timeToLivePopularSetting &&
          <Form.Item className="ttl mb0" colon={false} label={
            <div className="row">
              <div className="col-auto">
                {intl.get('trade.custom_option_fee')}
              </div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={timeToLiveChange.bind(this)}>{this.state.timeToLivePopularSetting ? intl.get('trade.more') : intl.get('trade.popular_option')}</a></div>
            </div>
          }>
            {form.getFieldDecorator('timeToLivePopularSetting')(
              <RadioGroup>
                <RadioButton value="1hour">1 {intl.get('trade.hour')}</RadioButton>
                <RadioButton value="1day">1 {intl.get('trade.day')}</RadioButton>
                <RadioButton value="1week">1 {intl.get('trade.week')}</RadioButton>
                <RadioButton value="1month">1 {intl.get('trade.month')}</RadioButton>
              </RadioGroup>
            )}
          </Form.Item>}
          {!this.state.timeToLivePopularSetting &&
          <Form.Item className="mb5 ttl" colon={false} label={
            <div className="row">
              <div className="col-auto">
                {intl.get('trade.custom_option_fee')}
              </div>
              <div className="col"></div>
              <div className="col-auto"><a href="" onClick={timeToLiveChange.bind(this)}>{this.state.timeToLivePopularSetting ? intl.get('trade.more') : intl.get('trade.popular_option')}</a></div>
            </div>
          }>
            {form.getFieldDecorator('timeToLive', {
              rules: [{
                message: intl.get('trade.integer_verification_message'),
                validator: (rule, value, cb) => validateOptionInteger(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100" placeholder={intl.get('trade.time_to_live_input_place_holder')} size="large" addonAfter={timeToLiveSelectAfter}/>
            )}
          </Form.Item>}
        </div>
      } okText="Yes" cancelText="No" onConfirm={ttlConfirm.bind(this)}>
        <Tooltip title="Advance Setting">
          <a className="fs12 pointer color-black-3 mr5"><Icon type="edit" /></a>
        </Tooltip>
      </Popconfirm>
    )

    return (
      <div>
        <Form layout="horizontal">
          <Form.Item>
            <div className="row mb5">
              <div className="col fs22 color-black-1 text-capitalize">{side === "sell" ? intl.get('trade.sell') : intl.get('trade.buy')} {tokenL}</div>
              <div className="col-auto">
                {
                  side === 'buy' ? `${tokenR} ${intl.get('trade.balance')}: ${fmR.getAmount(tokenRBalanceOriginal.balance)}` : `${tokenL} ${intl.get('trade.balance')}: ${fmL.getAmount(tokenLBalanceOriginal.balance)}`
                }
              </div>
            </div>
          </Form.Item>
          <Form.Item label={intl.get('trade.price')} {...formItemLayout} colon={false} extra={
            null &&
            <div className="row">
              <div className="col fs10">{priceValue}</div>
            </div>
          }>
            {form.getFieldDecorator('price', {
              initialValue: displayPrice,
              rules: [{
                message: intl.get('trade.price_verification_message'),
                validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={<span className="fs14 color-black-4">{tokenR}</span>}
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
          <Form.Item label={intl.get('trade.amount')} {...formItemLayout} colon={false} extra={
            <div>
              {
                false &&
                <div className="fs10">{`${intl.get('trade.available_amount')} ${this.state.availableAmount >0 ? this.state.availableAmount : availableAmount}`}</div>
              }
              <div className="fs10" style={{marginBottom:"-10px"}}>{amountSlider}</div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [{
                message: intl.get('trade.amount_verification_message'),
                validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
              }]
            })(
              <Input placeholder="" size="large" suffix={<span className="fs14 color-black-4">{tokenL}</span>} onChange={inputChange.bind(this, 'amount')}
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
          <Form.Item className="pt0 pb0" colon={false} label={null}>
            <div className="row align-items-center">
              <div className="col-auto">{intl.get('trade.total')}</div>
              <div className="col"></div>
              <div className="col-auto">{`${this.state.total} ${tokenR}`}</div>
            </div>
          </Form.Item>
          <Form.Item className="pt0 pb0" colon={false} label={null}>
            <div className="row align-items-center">
              <div className="col-auto">
                {intl.get('trade.lrc_fee')}
                <Tooltip title={intl.getHTML('trade.tips_lrc_fee')}>
                  <Icon className="color-gray-500 ml5" type="question-circle"/>
                </Tooltip>
              </div>
              <div className="col"></div>
              <div className="col-auto pl0 pr5">{editLRCFee}</div>
              <div className="col-auto pl0">{calculatedLrcFee} LRC</div>
            </div>
          </Form.Item>
          <Form.Item className="pt0 pb0" colon={false} label={null}>
            <div className="row align-items-center">
              <div className="col-auto">
                {intl.get('trade.time_to_live')}
                <Tooltip title={intl.getHTML('trade.tips_time_to_live')}>
                  <Icon className="color-gray-500 ml5" type="question-circle"/>
                </Tooltip>
              </div>
              <div className="col"></div>
              <div className="col-auto pl0 pr5">{editOrderTTL}</div>
              <div className="col-auto pl0">{ttlShow}</div>
            </div>
          </Form.Item>
          {account && account.isUnlocked && window.WALLET_UNLOCK_TYPE === 'Trezor' &&
            <div className="bg-blue-grey-50 text-center pt15 pb15" style={{borderRadius:'4px'}}>
              {intl.get('trade.place_order_trezor_unsupport') }
              <Tooltip title={intl.getHTML('trade.place_order_trezor_unsupport_tips')}>
                <Icon className="color-gray-500 mr10" type="question-circle"/>
              </Tooltip>
            </div>
          }
          {account && account.isUnlocked && isWatchOnly &&
          <div className="bg-blue-grey-50 text-center pt15 pb15" style={{borderRadius:'4px'}}>
            {intl.get('trade.place_order_trezor_unsupport') }
            <Tooltip title={intl.getHTML('trade.place_order_watch_only_tips')}>
              <Icon className="color-gray-500 mr10" type="question-circle"/>
            </Tooltip>
          </div>
          }
          {account && account.isUnlocked && window.WALLET_UNLOCK_TYPE && window.WALLET_UNLOCK_TYPE !== 'Trezor' && !isWatchOnly &&
          <Form.Item>
            {
              side == 'buy' &&
              <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-green-500 border-none color-white"
                      size="large">
                {intl.get('trade.place_order')}
              </Button>
            }
            {
              side == 'sell' &&
              <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-red-500 border-none color-white"
                      size="large">
                {intl.get('trade.place_order')}
              </Button>
            }
          </Form.Item>
          }
          {(!account || !account.isUnlocked) &&
            <Form.Item>
            {
              side == 'buy' &&
              <Button onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'TradeFrom'})} type="" className="d-block w-100 bg-green-500 border-none color-white"
                      size="large">
                {intl.get('trade.unlock_your_wallet')} {intl.get('trade.to_trade')}
              </Button>
            }
            {
              side == 'sell' &&
              <Button onClick={showModal.bind(this,{id:'wallet/unlock', pageFrom:'TradeFrom'})} type="" className="d-block w-100 bg-red-500 border-none color-white"
                      size="large">
                {intl.get('trade.unlock_your_wallet')} {intl.get('trade.to_trade')}
              </Button>
            }
            </Form.Item>
          }
        </Form>
      </div>
    );
  };
}

export default Form.create()(connect()(TradeForm));
