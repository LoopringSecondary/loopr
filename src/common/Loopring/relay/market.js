import request from '../common/request'
import validator from './validator'
import Response from '../common/response'
import code from "../common/code"

// import {ADDRESS,RPC_TAG,HEX} from './types'

let headers = {
  'Content-Type': 'application/json'
}

// ==================
// Market & Content
// ==================

export async function getPriceQuote(currency) {
  try {
    await validator.validate({value: currency, type: 'CURRENCY'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getPriceQuote'
  body.params = [currency]
  return request({
    method: 'post',
    headers,
    body,
  })
}

export async function getSupportedMarket() {
  let body = {}
  body.method = 'loopring_getSupportedMarket'
  body.params = []
  return request({
    method: 'post',
    headers,
    body,
  })
}

export async function getDepth(filter) {
  try {
    await validator.validate({value: filter.delegateAddress, type: 'ADDRESS'})
    await validator.validate({value: filter.market, type: 'STRING'})
    await validator.validate({value: filter.length, type: 'OPTION_NUMBER'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getDepth'
  body.params = [filter]
  return request({
    method: 'post',
    headers,
    body,
  })
}

export async function getTicker(filter) {
  try {
    await validator.validate({value: filter.delegateAddress, type: 'ADDRESS'});// contractVersion
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getTicker'
  body.params = [filter]
  return request({
    method: 'post',
    headers,
    body,
  })
}


export async function getTrend(market) {
  try {
    await validator.validate({value: market, type: 'STRING'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getTrend'
  body.params = [market]
  return request({
    method: 'post',
    headers,
    body,
  })
}

