import request from '../common/request'
import validator from './market_validator'
import Response from '../common/response'

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
    return new Response("111", "msg")
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

export async function getDepth(filter) {
  try {
    await validator.validate({value: filter.contractVersion, type: 'STRING'})
    await validator.validate({value: filter.market, type: 'STRING'})
    await validator.validate({value: filter.length, type: 'STRING'})
  } catch (e) {
    return new Response("111", "msg")
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

export async function getTicker(market) {
  // TODO Validator
  let body = {}
  body.method = 'loopring_getTicker'
  body.params = [market]
  return request({
    method: 'post',
    headers,
    body,
  })
}


export async function getTrend(market) {
  // TODO Validator
  let body = {}
  body.method = 'loopring_getTrend'
  body.params = [market]
  return request({
    method: 'post',
    headers,
    body,
  })
}

export async function getRingMined(filter) {
  // TODO Validator
  // filter: ringHash, pageIndex, pageSize,contractVersion

  let body = {}
  body.method = 'loopring_getRingMined'
  body.params = [filter]
  return request({
    method: 'post',
    headers,
    body,
  })
}

