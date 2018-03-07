import validator from '../common/validator'
import request from '../common/request'
import {generateAbiData} from './abi';
import Transaction from './transaction';

export async function getTransactionCount(address, tag) {
  try {
    validator.validate({value: address, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  tag = tag || "pending";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending,earliest')
    }
  }
  const params = [address, tag];
  const body = {};
  body.method = 'eth_getTransactionCount';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}

export async function getGasPrice() {
  const params = [];
  const body = {};
  body.method = 'eth_gasPrice';
  body.params = params;

  return request({
    method: 'post',
    body,
  })
}

export async function estimateGas(tx) {
  const params = [JSON.stringify(tx)];
  const body = {};
  body.method = 'eth_estimateGas';
  body.params = params;

  return request({
    method: 'post',
    body,
  })
}

export async function getAccountBalance(address, tag) {
  try {
    validator.validate({value: address, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  tag = tag || "pending";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending,earliest')
    }
  }
  const params = [address, tag];
  const body = {};
  body.method = 'eth_getBalance';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}

export async function getTransactionByhash(hash) {

  try {
    validator.validate({value: hash, type: "ETH_DATA"})
  } catch (e) {
    throw new Error('Invalid Transaction Hash')
  }
  const params = [hash];
  const body = {};
  body.method = 'eth_getTransactionByHash';
  body.params = params;
  return request({
    method: 'post',
    body,
  })

}


export async function bindAddress({projectId, address, to, privateKey, gasPrice, gasLimit, nonce, chainId,walletType,path}) {

  validator.validate({value: to, type: 'ADDRESS'});
  const tx = {};
  tx.to = to;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "bind", address: address, projectId});
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
  transaction.send({privateKey,walletType,path})
}

