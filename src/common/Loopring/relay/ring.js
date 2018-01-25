import request from '../common/request'

let headers = {
    'Content-Type': 'application/json'
}

export async function getRings(filter){
    let body = {}
    body.method = 'loopring_getRingMined'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    })
}


