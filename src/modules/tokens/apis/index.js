import request from './request'

let headers = {
    'Content-Type': 'application/json'
}

export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter.ringHash = filters.ringHash
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    // TODO Validator
    // filter: ringHash, pageIndex, pageSize,contractVersion
    
    let body = {}
    body.method = 'loopring_getRingMined'
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
