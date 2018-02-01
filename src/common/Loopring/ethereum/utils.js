import validator from '../common/validator'
import request from '../common/request'


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

export async function getAccountBalance(address,tag) {
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

