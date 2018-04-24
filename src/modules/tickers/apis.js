import {getTicker} from 'Loopring/relay/market'


export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {
      "delegateAddress" :window.CONFIG.getDelegateAddress()
    }
    return getTicker(filter).then(res=>{
      return {
        items:res.result, // why not res.result.data
        page:{
          current:res.result.pageIndex,
          size:res.result.pageSize,
          total:res.result.total,
        }
      }
    })
}
