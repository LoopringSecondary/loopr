import request from './request'
import validator from './validator'
import abis from './abis'
// import {ADDRESS,RPC_TAG,HEX} from './types'

let headers = {
    'Content-Type': 'application/json'
}

// ==================
// Transaction
// ==================

export async function getTransactionCount(add,tag){
  // validator.validate({value:add,type:'ADDRESS'})
  // validator.validate({value:tag,type:'RPC_TAG'})

  let body = {}
  body.method = 'eth_getTransactionCount'
  body.params = [add,tag]
  return request({
    method:'post',
    headers,
    body,
  })
}

export async function sendRawTransaction(signedTx){
    // validator.validate({value:signedTx,type:'HEX',})

    let body = {}
    body.method = 'eth_sendRawTransaction'
    body.params = [signedTx]
    return request({
      method:'post',
      headers,
      body,
    })
}

// ==================
// Order
// ==================

export async function submitOrder(order_json_stringify){
    // TODO validator
    // validator.isJson(order_json_stringify)
    let body = {}
    body.method = 'loopring_submitOrder'
    body.params = [order_json_stringify]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function cancelLoopringOrder(rawTX, privateKey){

    // 不需要 单独的接口，用的是tx的接口，待定
    // const tx = await this.generateTx(rawTX, privateKey)
    // return this.sendSignedTx(tx.signedTx)
}

export async function getOrders(filter){
    // TODO validator

    let body = {}
    body.method = 'loopring_getOrders'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}

// ==================
// Account
// ==================

export async function getCutOff(add, contractVersion, tag){
    // validator.validate({value:address,type:'ADDRESS'})
    // validator.validate({value:tag,type:'RPC_TAG'})
    let body = {}
    body.method = 'loopring_getCutoff'
    body.params = [add, contractVersion];
    return request({
      method:'post',
      headers,
      body,
    })
}

// ==================
// Token
// ==================

export async function getEthBalance(address,tag){
    // validator.validate({value:address,type:'ADDRESS'})
    // validator.validate({value:tag,type:'RPC_TAG'})
    let body = {}
    body.method = 'eth_getBalance'
    body.params = [address,tag]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getBalances(owner, contractVersion){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getBalance'
    body.params = [{owner, contractVersion}]
    return request({
      method:'post',
      headers,
      body,
    })
}

export async function getTokenBalance(token, add, tag){
    const data = abis.generateBalanceOfData(add) // TODO
    let body = {}
    body.method = 'eth_call'
    body.params = [{
      to: token,
      data
    }]
    return request({
      method:'post',
      headers,
      body,
    })
    // return new BigNumber(await this.call(params, tag)) // TODO
}

export async function getTokenAllowance(token, owner, spender, tag){
      const data = abis.generateAllowanceData(owner, spender);
      let body = {}
      body.method = 'eth_call'
      body.params = [{
        to: token,
        data
      }]
      return request({
        method:'post',
        headers,
        body,
      })
      // return new BigNumber(await this.call(params, tag));
}

export async function getEstimatedAllocatedAllowance(owner, token){
    // TODO Validator
    let body = {}
    body.method = 'loopring_getEstimatedAllocatedAllowance'
    body.params = [owner, token]
    return request({
      method:'post',
      headers,
      body,
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
    // filter:ringHash, orderHash, miner, pageIndex, pageSize,contractVersion
    let body = {}
    body.method = 'loopring_getRingMined'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}

