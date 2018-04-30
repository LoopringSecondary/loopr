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
  const delegateAddress = window.CONFIG.getDelegateAddress()
  const params = [{owner, token,delegateAddress}];
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


export async function notifyTransactionSubmitted({from, rawTx, txHash}) {

  try {
    validator.validate({value: from, type: "ADDRESS"});
    validator.validate({value: rawTx, type: "TX"});
    validator.validate({value: txHash, type: "TX_HASH"});
  } catch (e) {
    throw new Error('Invalid transaction hash')
  }
  const {nonce, to, value, gasPrice, gasLimit, data} = rawTx;
  const params = [{hash: txHash, nonce, to, value, gasPrice, gas: gasLimit, input: data, from,}];
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

export function getPendingRawTxByHash(txHash) {
  try {
    validator.validate({value: txHash, type: "TX_HASH"})
  } catch (e) {
    throw new Error('Invalid tx hash')
  }
  const params = [{thxHash:txHash}];
  const body = {};
  body.method = 'loopring_getPendingRawTxByHash';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}




