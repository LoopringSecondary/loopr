import request from '../common/request'
import Response from '../common/response'
import code from "../common/code"
import {generateAbiData} from '../ethereum/abi'
import validator from './validator'
import Transaction from './transaction'

let headers = {
  'Content-Type': 'application/json'
}
export async function getOrders(filter){
  try {
    await validator.validate({value: filter.contractVersion, type: 'STRING'})
    await validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'})
    await filter.market && validator.validate({value: filter.market, type: 'STRING'})
    await filter.owner && validator.validate({value: filter.owner, type: 'STRING'})
    await filter.orderHash && validator.validate({value: filter.orderHash, type: 'STRING'})
    await filter.pageSize && validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getOrders'
  body.params = [filter]
  return request({
    method:'post',
    headers,
    body,
  })
}

export async function getCutoff(address, contractVersion){
  try {
    await validator.validate({value: address, type: 'STRING'})
    await validator.validate({value: contractVersion, type: 'STRING'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getCutoff'
  body.params = [address, contractVersion, "latest"]
  return request({
    method:'post',
    headers,
    body,
  })
}

export async function cancelOrder(order,privateKey,gasPrice, gasLimit, nonce, chainId){

  // validator.validate({value:order,type:"Order"});
  const tx = {};
  tx.to = this.address;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "cancelOrder",order});

  if (gasPrice) {
    tx.gasPrice = gasPrice
  }
  if (gasLimit) {
    tx.gasLimit = gasLimit
  }
  if (nonce) {
    tx.nonce = nonce
  }
  if (chainId) {
    tx.chainId = chainId
  }
  const transaction = new Transaction(tx);
  return transaction.send(privateKey)
}
export async function cancelAllOrders(privateKey,timestamp,gasPrice, gasLimit, nonce, chainId){
  const tx = {};
  tx.to = this.address;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "setCutoff",timestamp});

  if (gasPrice) {
    tx.gasPrice = gasPrice
  }
  if (gasLimit) {
    tx.gasLimit = gasLimit
  }
  if (nonce) {
    tx.nonce = nonce
  }
  if (chainId) {
    tx.chainId = chainId
  }
  const transaction = new Transaction(tx);
  return transaction.send(privateKey)
}
