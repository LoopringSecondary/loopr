import request from '../common/request'
import Response from '../common/response'
import code from "../common/code"
import {generateAbiData, solSHA3, isValidSig} from '../ethereum/abi'
import validator from './validator'
import Transaction from '../ethereum/transaction'
import {toBN, toNumber, toHex, toBuffer, addHexPrefix, clearPrefix} from "../common/formatter";
import {hashPersonalMessage, ecsign, sha3} from "ethereumjs-util"
import {privateKeytoAddress} from "../ethereum/account";


let headers = {
  'Content-Type': 'application/json'
}

export async function getOrders(filter) {
  try {
    const {delegateAddress, pageIndex, market, owner, orderHash, pageSize} = filter
    if (delegateAddress) validator.validate({value: filter.delegateAddress, type: 'ADDRESS'})
    if (pageIndex >= 0) validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'})
    if (market) filter.market && validator.validate({value: filter.market, type: 'STRING'})
    if (owner) filter.owner && validator.validate({value: filter.owner, type: 'ADDRESS'})
    if (orderHash) filter.orderHash && validator.validate({value: filter.orderHash, type: 'STRING'})
    if (pageSize) filter.pageSize && validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'})
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

export async function getCutoff(address, delegateAddress) {
  try {
    await validator.validate({value: address, type: 'ADDRESS'})
    await validator.validate({value: delegateAddress, type: 'ADDRESS'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getCutoff'
  body.params = [address, delegateAddress, "latest"]
  return request({
    method: 'post',
    headers,
    body,
  })
}

export function generateCancelOrderTx({order, protocolAddress, gasPrice, gasLimit, nonce, chainId}) {

  validator.validate({value: order, type: "ORDER"});
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

  return tx
}

export function generateCancelAllOrdresTx({protocolAddress, timestamp, gasPrice, gasLimit, nonce, chainId}) {
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

  return tx
}

export function generateCancelOrdersByTokenPairTx({timestamp, tokenA, tokenB, protocolAddress, gasPrice, gasLimit, nonce, chainId}) {
  const tx = {};
  tx.to = protocolAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "cancelOrdersByTokenPairs", timestamp, tokenA, tokenB});

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

  return tx
}

export function cancelOrder({order, privateKey, protocolAddress, gasPrice, gasLimit, nonce, chainId, walletType, dapth}) {
  const tx = generateCancelOrderTx({order, privateKey, protocolAddress, gasPrice, gasLimit, nonce, chainId})
  const transaction = new Transaction(tx);
  return transaction.send({privateKey, walletType, dapth})
}

export function cancelOrdersByTokenPair({privateKey, timestamp, tokenA, tokenB, protocolAddress, gasPrice, gasLimit, nonce, chainId, walletType, path}) {
  const tx = generateCancelOrdersByTokenPairTx({
    timestamp,
    tokenA,
    tokenB,
    protocolAddress,
    gasPrice,
    gasLimit,
    nonce,
    chainId
  })
  const transaction = new Transaction(tx);
  return transaction.send({privateKey, walletType, path})
}

export function cancelAllOrders({privateKey, protocolAddress, timestamp, gasPrice, gasLimit, nonce, chainId, walletType, path}) {
  const tx = generateCancelAllOrdresTx({protocolAddress, timestamp, gasPrice, gasLimit, nonce, chainId});
  const transaction = new Transaction(tx);
  return transaction.send({privateKey, walletType, path})
}

export async function placeOrder(order) {

  validator.validate({value: order, type: "Order"});
  let body = {};
  body.method = 'loopring_submitOrder';
  body.params = [order];
  return request({
    method: 'post',
    body,
  })
}

export function sign(order, privateKey) {
  validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
  try {
    if (typeof privateKey === 'string') {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
      privateKey = toBuffer(addHexPrefix(privateKey))
    } else {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
    }
  } catch (e) {
    throw new Error('Invalid private key')
  }

  const hash = getOrderHash(order);
  const signature = ecsign(hashPersonalMessage(hash), privateKey);
  const v = toNumber(signature.v);
  const r = toHex(signature.r);
  const s = toHex(signature.s);
  return {
    ...order, v, r, s
  }
}


export function getOrderHash(order) {

  validator.validate({value: order, type: 'RAW_Order'});
  const orderTypes = [
    'address',
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
    order.delegateAddress,
    order.owner,
    order.tokenS,
    order.tokenB,
    order.walletAddress,
    order.authAddr,
    toBN(order.amountS),
    toBN(order.amountB),
    toBN(order.validSince),
    toBN(order.validUntil),
    toBN(order.lrcFee),
    order.buyNoMoreThanAmountB,
    order.marginSplitPercentage
  ];

  return solSHA3(orderTypes, orderData);
}
