import request from '../common/request'
import validator from '../common/validator'
import Response from '../common/response'
import code from "../common/code"

let headers = {
    'Content-Type': 'application/json'
}
export async function getFills(filter){
  try {
    await validator.validate({value: filter.delegateAddress, type: 'ADDRESS'})
    await validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'})
    await filter.market && validator.validate({value: filter.market, type: 'STRING'})
    await filter.owner && validator.validate({value: filter.owner, type: 'STRING'})
    await filter.ringHash && validator.validate({value: filter.ringHash, type: 'STRING'})
    await filter.orderHash && validator.validate({value: filter.orderHash, type: 'STRING'})
    await filter.pageSize && validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg)
  }
  let body = {}
  body.method = 'loopring_getFills'
  body.params = [filter]
  return request({
    method:'post',
    headers,
    body,
  })
}




