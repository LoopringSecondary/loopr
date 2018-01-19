import request from './request'

// import {ADDRESS,RPC_TAG,HEX} from './types'

let headers = {
    'Content-Type': 'application/json'
}

window.LOOPRING_PROVIDER_HOST = 'https://relay1.loopring.io/rpc'


export async function getOrders(payload){
    // https://github.com/Loopring/relay/blob/master/JSONRPC.md#loopring_getorders
    // params: {
    //   "owner" : "0x847983c3a34afa192cfee860698584c030f4c9db1",
    //   "orderHash" : "0xf0b75ed18109403b88713cd7a1a8423352b9ed9260e39cb1ea0f423e2b6664f0",
    //   "status" : "ORDER_CANCEL",
    //   "contractVersion" : "v1.0",
    //   "market" : "coss-weth",
    // }
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter = {
        ...filters
      }
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    
    let body = {}
    body.method = 'loopring_getOrders'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    }).then(res=>{
      return {
        items:res.result.data,
        page:{
          current:res.result.pageIndex,
          size:res.result.pageSize,
          total:res.result.total,
        }
      }
    })
}

export async function getRings(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter.ringHash = filters.ringHash
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    // TODO Validator
    // filter: ringHash, pageIndex, pageSize,contractVersion
    
    let body = {}
    body.method = 'loopring_getRingMined'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    }).then(res=>{
      return {
        items:res.result.data,
        page:{
          current:res.result.pageIndex,
          size:res.result.pageSize,
          total:res.result.total,
        }
      }
    })
}


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

