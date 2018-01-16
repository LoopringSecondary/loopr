import request from './request'

// import {ADDRESS,RPC_TAG,HEX} from './types'

let headers = {
    'Content-Type': 'application/json'
}

window.LOOPRING_PROVIDER_HOST = 'https://relay1.loopring.io/rpc'

// ==================
// Market & Content
// ==================

export async function getPriceQuote(currency){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getPriceQuote'
    body.params = [currency]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getDepth(filter){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getDepth'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getTicker(market){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getTicker'
    body.params = [market]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getFills(filter){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getFills'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getTrend(market){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getTrend'
    body.params = [market]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getRingMined(filter){
    // TODO Validator
    // filter: ringHash, pageIndex, pageSize,contractVersion
    
    let body = {}
    body.method = 'loopring_getRingMined'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}

