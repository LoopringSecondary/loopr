import request from '../common/request'
import Response from '../common/response'
import code from "../common/code"
import {generateAbiData, solSHA3} from '../ethereum/abi'
import validator from './validator'
import Transaction from '../ethereum/transaction'
import {toBN, toNumber, toHex} from "../common/formatter";
import {hashPersonalMessage, ecsign} from "ethereumjs-util"

let headers = {
  'Content-Type': 'application/json'
}

export async function getOrders(filter) {
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
    method: 'post',
    headers,
    body,
  })
}

export async function getCutoff(address, contractVersion) {
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
    method: 'post',
    headers,
    body,
  })
}

export async function cancelOrder({order, privateKey,protocolAddress, gasPrice, gasLimit, nonce, chainId}) {

  validator.validate({value:order,type:"ORDER"});
  const tx = {};
  tx.to = protocolAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "cancelOrder", order});

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

export async function cancelOrdersByTokenPair({privateKey,timestamp,tokenA,tokenB,protocolAddress,gasPrice, gasLimit, nonce, chainId}) {
  const tx = {};
  tx.to = protocolAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "cancelOrdersByTokenPairs", timestamp,tokenA,tokenB});

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

export async function cancelAllOrders({privateKey,protocolAddress, timestamp, gasPrice, gasLimit, nonce, chainId}) {
  const tx = {};
  tx.to = protocolAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "cancelAllOrders", timestamp});

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

export async function placeOrder(order) {

  validator.validate({value: order, type: "Order"})
  let body = {};
  body.method = 'loopring_submitOrder';
  body.params = [order];
  return request({
    method: 'post',
    body,
  })
}

export async function sign(order, privateKey) {
  validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
  validator.validate({value: order, type: 'RAW_Order'});
  const orderTypes = [
    'address',
    'address',
    'address',
    'address',
    'address',
    'uint',
    'uint',
    'uint',
    'uint',
    'uint',
    'bool',
    'uint8'
  ];

  const orderData = [
    order.protocol,
    order.owner,
    order.tokenS,
    order.tokenB,
    order.authAddr,
    toBN(order.amountS),
    toBN(order.amountB),
    toBN(order.validSince),
    toBN(order.validUntil),
    toBN(order.lrcFee),
    order.buyNoMoreThanAmountB,
    toBN(order.walletId),
    order.marginSplitPercentage
  ];
  const hash = solSHA3(orderTypes, orderData);
  const finalHash = hashPersonalMessage(hash);
  const signature = ecsign(finalHash, privateKey);
  const v = toNumber(signature.v);
  const r = toHex(signature.r);
  const s = toHex(signature.s);
  return {
    ...order, v, r, s
  }
}
