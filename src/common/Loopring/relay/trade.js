import request from '../common/request'

let headers = {
    'Content-Type': 'application/json'
}
export async function getFills(filter){
    let body = {}
    body.method = 'loopring_getFills'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}




