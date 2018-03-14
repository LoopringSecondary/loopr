import {getFills} from 'Loopring/relay/trade'

export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      // filter.ringHash = filters.ringHash
      filter = {
        ...filters
      }
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    filter.contractVersion = 'v1.2'
    filter.owner = window.WALLET.getAddress()
    return getFills(filter).then(res=>{
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
