import request from '../common/request'
import validator from '../common/validator'

let headers = {
  'Content-Type': 'application/json'
}

export async function getPendingTxs({owner, size, status}) {

  try {
    validator.validate({value: owner, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  const pageSize = size || 200;
  status = status || 'pending';
  const params = [{owner, pageSize, status}];
  const body = {};
  body.method = 'loopring_getTransactions';
  body.params = params;
  return request({
    method: 'post',
    body,
  })

}

export async function getEstimatedAllocatedAllowance(owner, token) {
  try {
    validator.validate({value: owner, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  const params = [{owner, token}];
  const body = {};
  body.method = 'loopring_getEstimatedAllocatedAllowance';
  body.params = params;
  return request({
    method: 'post',
    body,
  })


}

export async function getFrozenLrcFee(owner) {
  try {
    validator.validate({value: owner, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  const params = [{owner}];
  const body = {};
  body.method = 'loopring_getFrozenLRCFee';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}

export async function getGasPrice(filter) {
  let body = {}
  body.method = 'eth_gasPrice'
  body.params = []
  return request({
    method: 'post',
    headers,
    body,
  })
}


export async function notifyTransactionSubmitted(txHash) {

  try {
    validator.validate({value: txHash, type: "TX_HASH"})
  } catch (e) {
    throw new Error('Invalid transaction hash')
  }
  const params = [{txHash}];
  const body = {};
  body.method = 'loopring_notifyTransactionSubmitted';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}

export async function getOldWethBalance(owner) {
  try {
    validator.validate({value: owner, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid address')
  }
  const params = [{owner}];
  const body = {};
  body.method = 'loopring_getOldVersionWethBalance';
  body.params = params;
  return request({
    method: 'post',
    body,
  })

}

