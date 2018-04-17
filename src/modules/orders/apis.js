import {getOrders} from 'Loopring/relay/order'

export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter = {...filters}
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    filter.contractVersion = window.STORAGE.settings.getContractVersion()
    filter.owner = window.WALLET && window.WALLET.getAddress()
    return getOrders(filter).then(res=>{
      if(!res.error && res.result.data){
        return {
          items:res.result.data,
          page:{
            current:res.result.pageIndex,
            size:res.result.pageSize,
            total:res.result.total,
          }
        }
      }else{
        // res.error.code
      }
    })
}
