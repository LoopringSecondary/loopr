import request from '../common/request'
import validator from '../common/validator'

export async function getPendingTxs({owner, size,status}) {

  try {
    validator.validate({value: owner, type: "ADDRESS"})
  } catch (e) {
    throw new Error('Invalid Address')
  }
  const pageSize = size || 200;
  status  = status || 'pending';
  const params = [{owner,pageSize,status}];
  const body = {};
  body.method = 'loopring_getTransactions';
  body.params = params;
  return request({
    method: 'post',
    body,
  })

}
