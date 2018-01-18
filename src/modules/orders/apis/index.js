import request from './request'

let headers = {
    'Content-Type': 'application/json'
}

export async function fetchList(payload){
    // https://github.com/Loopring/relay/blob/master/JSONRPC.md#loopring_getorders
    // params: {
    //   "owner" : "0x847983c3a34afa192cfee860698584c030f4c9db1",
    //   "orderHash" : "0xf0b75ed18109403b88713cd7a1a8423352b9ed9260e39cb1ea0f423e2b6664f0",
    //   "status" : "ORDER_CANCEL",
    //   "contractVersion" : "v1.0",
    //   "market" : "coss-weth",
    // }
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter = {
        ...filters
      }
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    
    let body = {}
    body.method = 'loopring_getOrders'
    body.params = [filter]
    return request({
      method:'post',
      headers,
      body,
    }).then(res=>{
      return {
        items:res.result.data,
        page:{
          current:res.result.pageIndex,
          size:res.result.pageSize,
          total:res.result.total,
        }
      }
    })
}
