import request from '../common/request'
import validator from './validator'
import Response from '../common/response'
import code from "../common/code"

let headers = {
  'Content-Type': 'application/json'
}

export async function getRings(filter){
  try {
    await validator.validate({value: filter.contractVersion, type: 'STRING'});
   if(filter.pageIndex){ await validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'})}
   if(filter.pageSize) {await validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'})}
  } catch (e) {
    console.error(e);
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {};
  body.method = 'loopring_getRingMined';
  body.params = [filter];
  return request({
    method:'post',
    headers,
    body,
  })
}


