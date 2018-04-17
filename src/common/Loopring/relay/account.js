import request from '../common/request'
import validator from './validator'
import Response from '../common/response'
import code from "../common/code"

export async function getBalance({contractVersion,owner}) {
  try {
    await validator.validate({value: contractVersion, type: 'STRING'})
    await validator.validate({value: owner, type: 'STRING'})
  } catch (e) {
    console.error(e);
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {};
  body.method = 'loopring_getBalance';
  body.params = [filter];
  return request({
    method: 'post',
    body,
  })
}

export async function getTransactionCount(add,tag){
  validator.validate({value:add,type:'ADDRESS'});
  validator.validate({value:tag,type:'RPC_TAG'});

  let body = {};
  body.method = 'eth_getTransactionCount';
  body.params = [add,tag];
  return request({
    method:'post',
    body,
  })
}

export async function register(owner) {

  let body = {};
  body.method = 'loopring_unlockWallet';
  body.params = [{owner}];
  return request({
    method:'post',
    body,
  })
}
