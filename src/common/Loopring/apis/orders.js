import request from './request'

let headers = {
    'Content-Type': 'application/json'
}
export async function getOrders(filter){
    let body = {}
    body.method = 'loopring_getOrders'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}


